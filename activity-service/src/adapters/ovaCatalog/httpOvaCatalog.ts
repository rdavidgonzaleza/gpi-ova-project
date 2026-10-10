import type { OvaCatalog } from "../../ports/ovaCatalog.js";

export class ContentServiceUnavailableError extends Error {}

export class HttpOvaCatalog implements OvaCatalog {
  constructor(private readonly baseUrl: string) {}

  async exists(ovaId: string): Promise<boolean> {
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}/api/ovas/${encodeURIComponent(ovaId)}`, {
        signal: AbortSignal.timeout(5000),
      });
    } catch {
      throw new ContentServiceUnavailableError();
    }

    if (response.status === 404) return false;
    if (!response.ok) throw new ContentServiceUnavailableError();
    return true;
  }
}
