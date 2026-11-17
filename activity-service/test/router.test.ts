// Pruebas de integración de activity-service contra un Postgres real.
// Requieren TEST_DATABASE_URL; sin ella se omiten.
import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { after, before, beforeEach, describe, it } from "node:test";
import { Pool } from "pg";
import { createRouter } from "../src/adapters/http/router.js";
import { PostgresActivityRepository } from "../src/adapters/repository/postgresActivityRepository.js";
import { CreateActivity } from "../src/application/createActivity.js";
import { GetActivity } from "../src/application/getActivity.js";
import { ListActivities } from "../src/application/listActivities.js";
import { RegisterActivityAttempt } from "../src/application/registerActivityAttempt.js";
import { ContentServiceUnavailableError } from "../src/adapters/ovaCatalog/httpOvaCatalog.js";

const dsn = process.env.TEST_DATABASE_URL;
const secret = "secreto-de-prueba";
const OVA = "6a1f0c2e-1111-4a1b-9c3d-000000000001";
const MISSING_OVA = "6a1f0c2e-1111-4a1b-9c3d-0000000000ff";
const DOWN_OVA = "6a1f0c2e-1111-4a1b-9c3d-0000000000ee";
const TEACHER = randomUUID();
const STUDENT = randomUUID();

function token(sub: string, role: string) {
  const payload = Buffer.from(JSON.stringify({ sub, role, exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url");
  return `${payload}.${createHmac("sha256", secret).update(payload).digest("base64url")}`;
}

const quiz = {
  ova_id: OVA,
  type: "quiz",
  title: "Comprueba los conceptos",
  description: "Tres preguntas",
  config: {
    position: 3,
    questions: [{ id: "q1", prompt: "¿Qué es la EDT?", options: [{ id: "a", text: "Un diagrama" }, { id: "b", text: "Un desglose" }], answer: "b" }],
  },
};

describe("activity-service", { skip: !dsn && "TEST_DATABASE_URL no está definida" }, () => {
  let pool: Pool;
  let app: ReturnType<typeof createRouter>;

  before(async () => {
    pool = new Pool({ connectionString: dsn });
    for (const file of ["001_create_activities.sql", "002_create_activity_attempts.sql"]) {
      await pool.query(readFileSync(new URL(`../migrations/${file}`, import.meta.url), "utf8"));
    }
    const repository = new PostgresActivityRepository(pool);
    const catalog = {
      async exists(id: string) {
        if (id === DOWN_OVA) throw new ContentServiceUnavailableError();
        return id === OVA;
      },
    };
    app = createRouter({
      createActivity: new CreateActivity(repository, catalog),
      listActivities: new ListActivities(repository),
      getActivity: new GetActivity(repository),
      registerActivityAttempt: new RegisterActivityAttempt(repository),
      jwtSecret: secret,
    });
  });
  beforeEach(() => pool.query("TRUNCATE activity_attempts, activities"));
  after(() => pool.end());

  const send = (method: string, path: string, body?: unknown, auth?: string) =>
    app.request(path, {
      method,
      headers: { "Content-Type": "application/json", ...(auth ? { Authorization: `Bearer ${auth}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

  it("GET /healthz responde ok", async () => {
    const res = await send("GET", "/healthz");
    assert.equal(res.status, 200);
    assert.equal(await res.text(), "ok");
  });

  it("POST /api/activities exige token de docente o administrador", async () => {
    assert.equal((await send("POST", "/api/activities", quiz)).status, 401);
    const res = await send("POST", "/api/activities", quiz, token(STUDENT, "estudiante"));
    assert.equal(res.status, 403);
    assert.equal((await res.json()).error.code, "FORBIDDEN");
  });

  it("POST /api/activities valida el config según el tipo (spec 5.3.1)", async () => {
    const auth = token(TEACHER, "docente");
    const badAnswer = structuredClone(quiz);
    badAnswer.config.questions[0].answer = "z";
    assert.equal((await send("POST", "/api/activities", badAnswer, auth)).status, 400);
    const badType = { ...quiz, type: "juego" };
    assert.equal((await send("POST", "/api/activities", badType, auth)).status, 400);
    const sim = { ova_id: OVA, type: "simulacion", title: "CPM", config: { position: 4, kind: "gantt", params: {} } };
    assert.equal((await send("POST", "/api/activities", sim, auth)).status, 400);
  });

  it("POST /api/activities valida el OVA en content-service", async () => {
    const auth = token(TEACHER, "docente");
    const missing = await send("POST", "/api/activities", { ...quiz, ova_id: MISSING_OVA }, auth);
    assert.equal(missing.status, 404);
    assert.equal((await missing.json()).error.code, "OVA_NOT_FOUND");
    assert.equal((await send("POST", "/api/activities", { ...quiz, ova_id: DOWN_OVA }, auth)).status, 502);
  });

  it("crea, lista y consulta actividades", async () => {
    const auth = token(TEACHER, "administrador");
    const sim = {
      ova_id: OVA, type: "simulacion", title: "Ruta crítica",
      config: { position: 1, kind: "cpm", params: { unit: "días", activities: [] } },
    };
    const created = await send("POST", "/api/activities", quiz, auth);
    assert.equal(created.status, 201);
    const activity = await created.json();
    assert.equal(activity.description, "Tres preguntas");
    assert.match(activity.created_at, /Z$/);
    assert.equal((await send("POST", "/api/activities", sim, auth)).status, 201);

    const list = await (await send("GET", `/api/activities?ova_id=${OVA}`)).json();
    assert.deepEqual(list.map((a: { title: string }) => a.title), ["Ruta crítica", "Comprueba los conceptos"]);
    assert.equal((await send("GET", "/api/activities?ova_id=x")).status, 400);

    const one = await send("GET", `/api/activities/${activity.id}`);
    assert.equal(one.status, 200);
    assert.equal((await one.json()).config.questions[0].id, "q1");
    assert.equal((await send("GET", `/api/activities/${randomUUID()}`)).status, 404);
  });

  it("POST /api/activities/{id}/attempts registra el intento del dueño del token", async () => {
    const activity = await (await send("POST", "/api/activities", quiz, token(TEACHER, "docente"))).json();
    const path = `/api/activities/${activity.id}/attempts`;
    const body = { student_id: STUDENT, answers: { q1: "b", interaction_id: randomUUID() } };

    assert.equal((await send("POST", path, body)).status, 401);
    assert.equal((await send("POST", path, body, token(randomUUID(), "estudiante"))).status, 403);
    assert.equal((await send("POST", path, { student_id: STUDENT }, token(STUDENT, "estudiante"))).status, 400);
    assert.equal((await send("POST", `/api/activities/${randomUUID()}/attempts`, body, token(STUDENT, "estudiante"))).status, 404);

    const res = await send("POST", path, body, token(STUDENT, "estudiante"));
    assert.equal(res.status, 201);
    const attempt = await res.json();
    assert.equal(attempt.student_id, STUDENT);
    assert.equal(attempt.answers.q1, "b");
  });
});
