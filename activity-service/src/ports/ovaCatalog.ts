export interface OvaCatalog {
  exists(ovaId: string): Promise<boolean>;
}
