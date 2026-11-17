import { canReadReports, type Requester } from "../domain/progress.js";
import { buildUsageReport, type UsageReport } from "../domain/usageReport.js";
import type { ProgressRepository } from "../ports/progressRepository.js";
import { ForbiddenError } from "./errors.js";

/**
 * US-7.2: reporte agregado de uso. En la v1 no existe una entidad de grupos,
 * así que `group_id` identifica el reporte y se agregan todos los registros
 * de progreso (spec 5.6: el servicio no hace JOIN con otras bases).
 */
export class GetUsageReport {
  constructor(private readonly progress: ProgressRepository, private readonly clock: () => Date = () => new Date()) {}

  async execute(requester: Requester, groupId: string): Promise<UsageReport> {
    if (!canReadReports(requester)) throw new ForbiddenError("solo docentes y administradores consultan reportes");
    return buildUsageReport(groupId, await this.progress.listAll(), this.clock());
  }
}
