// Pruebas de integración de tracking-service contra Postgres real.
// Requieren TEST_DATABASE_URL; sin ella se omiten.
import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { after, before, beforeEach, describe, it } from "node:test";
import { Pool } from "pg";
import { createRouter } from "../src/adapters/http/router.js";
import { PostgresProgressRepository } from "../src/adapters/repository/postgresProgressRepository.js";
import { GetUsageReport } from "../src/application/getUsageReport.js";
import { ListProgress } from "../src/application/listProgress.js";
import { UpsertProgress } from "../src/application/upsertProgress.js";

const dsn = process.env.TEST_DATABASE_URL;
const secret = "secreto-de-prueba";
const [ANA, LUIS, TEACHER] = [randomUUID(), randomUUID(), randomUUID()];
const [OVA1, OVA2] = [randomUUID(), randomUUID()];

function token(sub: string, role: string) {
  const payload = Buffer.from(JSON.stringify({ sub, role, exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url");
  return `${payload}.${createHmac("sha256", secret).update(payload).digest("base64url")}`;
}

describe("tracking-service", { skip: !dsn && "TEST_DATABASE_URL no está definida" }, () => {
  let pool: Pool;
  let app: ReturnType<typeof createRouter>;

  before(async () => {
    pool = new Pool({ connectionString: dsn });
    await pool.query(readFileSync(new URL("../migrations/001_create_progress.sql", import.meta.url), "utf8"));
    const repo = new PostgresProgressRepository(pool);
    app = createRouter({
      upsertProgress: new UpsertProgress(repo),
      listProgress: new ListProgress(repo),
      getUsageReport: new GetUsageReport(repo, () => new Date("2026-11-17T15:00:00Z")),
      jwtSecret: secret,
    });
  });
  beforeEach(() => pool.query("TRUNCATE progress"));
  after(() => pool.end());

  const send = (method: string, path: string, body?: unknown, auth?: string) =>
    app.request(path, {
      method,
      headers: { "Content-Type": "application/json", ...(auth ? { Authorization: `Bearer ${auth}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  const put = (student: string, ova: string, status: string, percent: number, auth = token(student, "estudiante")) =>
    send("PUT", "/api/progress", { student_id: student, ova_id: ova, status, percent_complete: percent }, auth);

  it("GET /healthz", async () => {
    assert.equal(await (await send("GET", "/healthz")).text(), "ok");
  });

  it("PUT /api/progress crea y luego actualiza el mismo registro", async () => {
    assert.equal((await put(ANA, OVA1, "en_progreso", 40, "")).status, 401);
    const first = await (await put(ANA, OVA1, "en_progreso", 40)).json();
    const res = await put(ANA, OVA1, "completado", 99.6);
    assert.equal(res.status, 200);
    const second = await res.json();
    assert.equal(second.id, first.id);
    assert.equal(second.percent_complete, 100);
    assert.equal(second.status, "completado");
    assert.match(second.last_accessed_at, /Z$/);
  });

  it("PUT /api/progress valida el cuerpo y el dueño", async () => {
    assert.equal((await put(ANA, OVA1, "terminado", 10)).status, 400);
    assert.equal((await put(ANA, OVA1, "en_progreso", 120)).status, 400);
    assert.equal((await put(ANA, OVA1, "en_progreso", 10, token(LUIS, "estudiante"))).status, 403);
    assert.equal((await put(ANA, OVA1, "en_progreso", 10, token(TEACHER, "docente"))).status, 200);
  });

  it("GET /api/progress respeta quién puede consultar", async () => {
    await put(ANA, OVA1, "en_progreso", 50);
    await put(ANA, OVA2, "completado", 100);
    assert.equal((await send("GET", `/api/progress?student_id=${ANA}`)).status, 401);
    assert.equal((await send("GET", `/api/progress?student_id=${ANA}`, undefined, token(LUIS, "estudiante"))).status, 403);
    assert.equal((await send("GET", "/api/progress?student_id=x", undefined, token(ANA, "estudiante"))).status, 400);
    const own = await (await send("GET", `/api/progress?student_id=${ANA}`, undefined, token(ANA, "estudiante"))).json();
    assert.equal(own.length, 2);
    const teacher = await send("GET", `/api/progress?student_id=${ANA}`, undefined, token(TEACHER, "docente"));
    assert.equal(teacher.status, 200);
  });

  it("GET /api/reports/usage agrega por OVA y exige rol docente", async () => {
    await put(ANA, OVA1, "completado", 100);
    await put(LUIS, OVA1, "en_progreso", 45);
    await put(LUIS, OVA2, "no_iniciado", 0);

    assert.equal((await send("GET", "/api/reports/usage?group_id=gpi-2026-2")).status, 401);
    assert.equal((await send("GET", "/api/reports/usage?group_id=gpi-2026-2", undefined, token(ANA, "estudiante"))).status, 403);
    assert.equal((await send("GET", "/api/reports/usage", undefined, token(TEACHER, "docente"))).status, 400);

    const res = await send("GET", "/api/reports/usage?group_id=gpi-2026-2", undefined, token(TEACHER, "docente"));
    assert.equal(res.status, 200);
    const report = await res.json();
    assert.equal(report.group_id, "gpi-2026-2");
    assert.equal(report.generated_at, "2026-11-17T15:00:00.000Z");
    assert.equal(report.total_students, 2);
    const row1 = report.rows.find((r: { ova_id: string }) => r.ova_id === OVA1);
    assert.deepEqual(row1, { ova_id: OVA1, students_started: 2, students_completed: 1, average_percent: 73 });
    const row2 = report.rows.find((r: { ova_id: string }) => r.ova_id === OVA2);
    assert.deepEqual(row2, { ova_id: OVA2, students_started: 0, students_completed: 0, average_percent: 0 });
  });
});
