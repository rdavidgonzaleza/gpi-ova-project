import { serve } from "@hono/node-server";
import { Pool } from "pg";
import { RegisterAttempt } from "./application/registerAttempt.js";
import { ListAttempts } from "./application/listAttempts.js";
import { createRouter } from "./adapters/http/router.js";
import { PostgresEvaluationRepository } from "./adapters/repository/postgresRepository.js";

const databaseUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;
if (!databaseUrl) throw new Error("DATABASE_URL es obligatorio");
if (!jwtSecret) throw new Error("JWT_SECRET es obligatorio");

const port = Number(process.env.PORT ?? 8085);
const pool = new Pool({ connectionString: databaseUrl });
const repository = new PostgresEvaluationRepository(pool);
const app = createRouter({
  registerAttempt: new RegisterAttempt(repository),
  listAttempts: new ListAttempts(repository),
  jwtSecret,
});

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`evaluation-service escuchando en :${info.port}`);
});
