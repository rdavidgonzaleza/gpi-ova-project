// Pruebas de integración de evaluation-service contra Postgres real.
// Requieren TEST_DATABASE_URL; sin ella se omiten.
import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { after, before, beforeEach, describe, it } from "node:test";
import { Pool } from "pg";
import { createRouter } from "../src/adapters/http/router.js";
import { PostgresEvaluationRepository } from "../src/adapters/repository/postgresRepository.js";
import { ListAttempts } from "../src/application/listAttempts.js";
import { ListEvaluations } from "../src/application/listEvaluations.js";
import { RegisterAttempt } from "../src/application/registerAttempt.js";

const dsn = process.env.TEST_DATABASE_URL;
const secret = "secreto-de-prueba";
const OVA = randomUUID();
const EVALUATION = randomUUID();
const STUDENT = randomUUID();

function token(sub: string, role: string) {
  const payload = Buffer.from(JSON.stringify({ sub, role, exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url");
  return `${payload}.${createHmac("sha256", secret).update(payload).digest("base64url")}`;
}

const config = {
  questions: [
    { id: "e1", correct_answer: "b", feedback_correct: "Bien: es la EDT.", feedback_incorrect: "Repasa la EDT." },
    { id: "e2", correct_answer: true, feedback_incorrect: "La regla del 100 % sí aplica." },
  ],
};

describe("evaluation-service", { skip: !dsn && "TEST_DATABASE_URL no está definida" }, () => {
  let pool: Pool;
  let app: ReturnType<typeof createRouter>;

  before(async () => {
    pool = new Pool({ connectionString: dsn });
    await pool.query(readFileSync(new URL("../migrations/001_create_evaluations.sql", import.meta.url), "utf8"));
    const repo = new PostgresEvaluationRepository(pool);
    app = createRouter({
      registerAttempt: new RegisterAttempt(repo),
      listAttempts: new ListAttempts(repo),
      listEvaluations: new ListEvaluations(repo),
      jwtSecret: secret,
    });
  });
  beforeEach(async () => {
    await pool.query("TRUNCATE evaluation_attempts, evaluations");
    await pool.query("INSERT INTO evaluations (id, ova_id, type, config) VALUES ($1, $2, 'autoevaluacion', $3)", [EVALUATION, OVA, config]);
  });
  after(() => pool.end());

  const send = (method: string, path: string, body?: unknown, auth?: string) =>
    app.request(path, {
      method,
      headers: { "Content-Type": "application/json", ...(auth ? { Authorization: `Bearer ${auth}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

  it("GET /api/evaluations no expone la clave de respuestas ni la retroalimentación", async () => {
    const res = await send("GET", `/api/evaluations?ova_id=${OVA}`);
    assert.equal(res.status, 200);
    const raw = await res.text();
    assert.doesNotMatch(raw, /correct_answer|feedback_correct|feedback_incorrect/);
    assert.deepEqual(JSON.parse(raw), [{ id: EVALUATION, ova_id: OVA, type: "autoevaluacion", config: { questions: [{ id: "e1" }, { id: "e2" }] } }]);
    assert.equal((await send("GET", "/api/evaluations?ova_id=x")).status, 400);
  });

  it("POST /api/evaluations/{id}/attempts califica en el servidor", async () => {
    const path = `/api/evaluations/${EVALUATION}/attempts`;
    const body = { student_id: STUDENT, answers: { e1: "b", e2: false } };
    assert.equal((await send("POST", path, body)).status, 401);
    assert.equal((await send("POST", path, body, token(STUDENT, "docente"))).status, 403);
    assert.equal((await send("POST", path, body, token(randomUUID(), "estudiante"))).status, 403);
    assert.equal((await send("POST", `/api/evaluations/${randomUUID()}/attempts`, body, token(STUDENT, "estudiante"))).status, 404);

    const res = await send("POST", path, body, token(STUDENT, "estudiante"));
    assert.equal(res.status, 201);
    const result = await res.json();
    assert.equal(result.score, 50);
    assert.match(result.feedback, /regla del 100 %/);
  });

  it("GET /api/evaluations/attempts devuelve el historial con control de acceso", async () => {
    await send("POST", `/api/evaluations/${EVALUATION}/attempts`, { student_id: STUDENT, answers: { e1: "b", e2: true } }, token(STUDENT, "estudiante"));
    const path = `/api/evaluations/attempts?student_id=${STUDENT}`;
    assert.equal((await send("GET", path)).status, 401);
    assert.equal((await send("GET", path, undefined, token(randomUUID(), "estudiante"))).status, 403);
    const own = await send("GET", path, undefined, token(STUDENT, "estudiante"));
    assert.equal(own.status, 200);
    const history = await own.json();
    assert.equal(history.length, 1);
    assert.equal(Number(history[0].score), 100);
    assert.equal((await send("GET", path, undefined, token(randomUUID(), "docente"))).status, 200);
  });

  it("GET /healthz", async () => {
    assert.equal(await (await send("GET", "/healthz")).text(), "ok");
  });
});
