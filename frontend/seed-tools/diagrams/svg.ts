// Small SVG toolkit for the OVA diagrams. Every shape uses the `.dg-*`
// classes from src/index.css, so an inlined diagram follows the app theme.
// The <style> below is only a fallback for opening the file on its own
// (Diagram.tsx strips it when inlining).

const FALLBACK = `
.dg-box{fill:#f2f2f7;stroke:#3c3c432e}.dg-card{fill:#fff;stroke:#3c3c434d}
.dg-accent{fill:#0066cc}.dg-accent-soft{fill:#0066cc1a;stroke:#0066cc59}
.dg-success-soft{fill:#248a3d1f;stroke:#1b7f3759}.dg-warning-soft{fill:#ff950024;stroke:#a3520059}
.dg-danger-soft{fill:#d7001517;stroke:#c4001a59}.dg-ai-soft{fill:#7c3aed17;stroke:#7c3aed59}
.dg-success{fill:#1b7f37}.dg-warning{fill:#a35200}.dg-danger{fill:#c4001a}
.dg-t{fill:#1d1d1f}.dg-t2{fill:#5e5e63}.dg-t3{fill:#86868b}.dg-on{fill:#fff}.dg-ta{fill:#0066cc}
.dg-ts{fill:#1b7f37}.dg-tw{fill:#a35200}.dg-td{fill:#c4001a}
.dg-line{stroke:#3c3c434d;stroke-width:1.75;fill:none}.dg-flow{stroke:#0066cc;stroke-width:2;fill:none}
.dg-head{fill:#0066cc}.dg-head-muted{fill:#86868b}.dg-dash{stroke:#86868b;stroke-width:1.5;stroke-dasharray:5 5;fill:none}
.dg-s1{stroke:#2a78d6;stroke-width:3;fill:none}.dg-s2{stroke:#eb6834;stroke-width:3;fill:none}
.dg-s3{stroke:#5e5e63;stroke-width:3;fill:none;stroke-dasharray:8 6}
.dg-f1{fill:#2a78d6}.dg-f2{fill:#eb6834}.dg-f3{fill:#5e5e63}
@media (prefers-color-scheme:dark){
.dg-box{fill:#2c2c2e;stroke:#5454588c}.dg-card{fill:#1c1c1e;stroke:#78788099}
.dg-accent{fill:#3b9eff}.dg-accent-soft{fill:#3b9eff29;stroke:#3b9eff59}
.dg-t{fill:#f5f5f7}.dg-t2{fill:#a1a1a6}.dg-t3{fill:#7c7c80}.dg-on{fill:#001a33}.dg-ta{fill:#3b9eff}
.dg-ts{fill:#34d058}.dg-tw{fill:#ffb340}.dg-td{fill:#ff6961}.dg-success{fill:#34d058}.dg-warning{fill:#ffb340}.dg-danger{fill:#ff6961}
.dg-line{stroke:#78788099}.dg-flow{stroke:#3b9eff}.dg-head{fill:#3b9eff}}`

const FONT = '-apple-system,BlinkMacSystemFont,Inter,Segoe UI,Roboto,sans-serif'

export type Anchor = 'start' | 'middle' | 'end'

export interface TextOptions {
  cls?: string
  size?: number
  weight?: number
  anchor?: Anchor
  /** Line height as a multiple of the font size. */
  leading?: number
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const n = (v: number) => Number(v.toFixed(1))

export class Svg {
  private parts: string[] = []

  constructor(
    readonly width: number,
    readonly height: number,
    private readonly label: string,
  ) {}

  rect(x: number, y: number, w: number, h: number, cls: string, rx = 12) {
    this.parts.push(`<rect class="${cls}" x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${rx}"/>`)
    return this
  }

  circle(cx: number, cy: number, r: number, cls: string) {
    this.parts.push(`<circle class="${cls}" cx="${n(cx)}" cy="${n(cy)}" r="${r}"/>`)
    return this
  }

  path(d: string, cls: string) {
    this.parts.push(`<path class="${cls}" d="${d}"/>`)
    return this
  }

  /** Multi-line text: `\n` breaks lines; `y` is the first baseline. */
  text(x: number, y: number, value: string, o: TextOptions = {}) {
    const size = o.size ?? 15
    const lines = value.split('\n')
    const leading = size * (o.leading ?? 1.3)
    const attrs = [
      `class="${o.cls ?? 'dg-t'}"`,
      `x="${n(x)}"`,
      `y="${n(y)}"`,
      `font-size="${size}"`,
      o.weight ? `font-weight="${o.weight}"` : '',
      o.anchor && o.anchor !== 'start' ? `text-anchor="${o.anchor}"` : '',
    ].filter(Boolean)
    const body =
      lines.length === 1
        ? esc(value)
        : lines.map((line, i) => `<tspan x="${n(x)}" dy="${i === 0 ? 0 : n(leading)}">${esc(line)}</tspan>`).join('')
    this.parts.push(`<text ${attrs.join(' ')}>${body}</text>`)
    return this
  }

  /** Straight arrow from (x1,y1) to (x2,y2) with a head at the end. */
  arrow(x1: number, y1: number, x2: number, y2: number, cls = 'dg-flow', head = 'dg-head') {
    const angle = Math.atan2(y2 - y1, x2 - x1)
    const len = 10
    const bx = x2 - len * Math.cos(angle)
    const by = y2 - len * Math.sin(angle)
    this.path(`M${n(x1)} ${n(y1)} L${n(bx)} ${n(by)}`, cls)
    const p = (a: number, r: number) => `${n(x2 - r * Math.cos(angle + a))} ${n(y2 - r * Math.sin(angle + a))}`
    this.path(`M${n(x2)} ${n(y2)} L${p(0.45, len + 2)} L${p(-0.45, len + 2)} Z`, head)
    return this
  }

  /** Elbow connector: horizontal, vertical, horizontal. */
  elbow(x1: number, y1: number, x2: number, y2: number, cls = 'dg-line') {
    const mx = (x1 + x2) / 2
    return this.path(`M${n(x1)} ${n(y1)} H${n(mx)} V${n(y2)} H${n(x2)}`, cls)
  }

  /** Milestone diamond, the brand's signature mark. */
  diamond(cx: number, cy: number, r: number, cls = 'dg-accent') {
    return this.path(`M${n(cx)} ${n(cy - r)} L${n(cx + r)} ${n(cy)} L${n(cx)} ${n(cy + r)} L${n(cx - r)} ${n(cy)} Z`, cls)
  }

  /** Numbered badge. */
  badge(cx: number, cy: number, label: string, cls = 'dg-accent', text = 'dg-on') {
    this.circle(cx, cy, 14, cls)
    return this.text(cx, cy + 5, label, { cls: text, size: 14, weight: 700, anchor: 'middle' })
  }

  raw(markup: string) {
    this.parts.push(markup)
    return this
  }

  toString() {
    return [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.width} ${this.height}" font-family="${FONT}" role="img" aria-label="${esc(this.label)}">`,
      `<style>${FALLBACK.replace(/\n/g, '')}</style>`,
      ...this.parts,
      '</svg>',
      '',
    ].join('\n')
  }
}
