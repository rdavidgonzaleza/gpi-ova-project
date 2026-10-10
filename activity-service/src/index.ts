import { serve } from "@hono/node-server";
import { Pool } from "pg";
import { CreateActivity } from "./application/createActivity.js";
import { ListActivities } from "./application/listActivities.js";
import { HttpOvaCatalog } from "./adapters/ovaCatalog/httpOvaCatalog.js";
import { createRouter } from "./adapters/http/router.js";
import { PostgresActivityRepository } from "./adapters/repository/postgresActivityRepository.js";

const databaseUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;
if (!databaseUrl) throw new Error("DATABASE_URL es obligatorio");
if (!jwtSecret) throw new Error("JWT_SECRET es obligatorio");

const port = Number(process.env.PORT ?? 8083);
const contentServiceUrl = (process.env.CONTENT_SERVICE_URL ?? "http://localhost:8082").replace(/\/$/, "");
const pool = new Pool({ connectionString: databaseUrl });
const repository = new PostgresActivityRepository(pool);
const app = createRouter({
  createActivity: new CreateActivity(repository, new HttpOvaCatalog(contentServiceUrl)),
  listActivities: new ListActivities(repository),
  jwtSecret,
});

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`activity-service escuchando en :${info.port}`);
});
