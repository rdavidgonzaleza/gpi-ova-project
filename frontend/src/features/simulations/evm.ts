export interface EVMIndicators {
  cv: number
  sv: number
  cpi: number
  spi: number
  eac: number
  vac: number
}

export function indicators(bac: number, pv: number, ev: number, ac: number): EVMIndicators {
  const cpi = ac ? ev / ac : 0
  const spi = pv ? ev / pv : 0
  const eac = cpi ? bac / cpi : 0
  return { cv: ev - ac, sv: ev - pv, cpi, spi, eac, vac: bac - eac }
}

export const fmt = (value: number, digits = 0) =>
  value.toLocaleString('es-CO', { minimumFractionDigits: digits, maximumFractionDigits: digits })
