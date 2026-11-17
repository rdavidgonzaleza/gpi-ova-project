import { serve } from "@hono/node-server";
import { Pool } from "pg";
import { createRouter } from "./adapters/http/router.js";
import { PostgresProgressRepository } from "./adapters/repository/postgresProgressRepository.js";
import { GetUsageReport } from "./application/getUsageReport.js";
import { ListProgress } from "./application/listProgress.js";
import { UpsertProgress } from "./application/upsertProgress.js";

const databaseUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;
if (!databaseUrl) throw new Error("DATABASE_URL es obligatorio");
if (!jwtSecret) throw new Error("JWT_SECRET es obligatorio");

const port = Number(process.env.PORT ?? 8086);
const repository = new PostgresProgressRepository(new Pool({ connectionString: databaseUrl }));

const app = createRouter({
  upsertProgress: new UpsertProgress(repository),
  listProgress: new ListProgress(repository),
  getUsageReport: new GetUsageReport(repository),
  jwtSecret,
});

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`tracking-service escuchando en :${info.port}`);
});
