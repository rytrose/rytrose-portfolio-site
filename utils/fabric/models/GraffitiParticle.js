import { classRegistry, Circle } from "fabric";
import { parseCSSColorToRGB } from "../utils";

class GraffitiParticle extends Circle {
  static type = "graffitiParticle";

  constructor(options = {}) {
    // Capture paintOpacity before super call overrides opacity to 1.
    // New groups pass paintOpacity explicitly; old groups pass opacity (the original value).
    const paintOpacity = options.paintOpacity !== undefined
      ? options.paintOpacity
      : options.opacity !== undefined ? options.opacity : 1;

    super({
      ...options,
      opacity: 1, // Fabric's globalAlpha must be 1 — gradient carries the alpha
      selectable: false,
      hoverCursor: "auto"
    });

    this.pX = options.pX || 0;
    this.pY = options.pY || 0;
    this._paintOpacity = paintOpacity;
    this._fill = null;    // cached fill value
    this._fillRGB = null; // cached [r, g, b]
  }

  _render(ctx) {
    const r = this.radius;
    if (r <= 0) return;

    // Lazy-parse fill color to RGB (once per fill value change)
    if (this.fill !== this._fill) {
      this._fill = this.fill;
      this._fillRGB = parseCSSColorToRGB(this.fill);
    }
    const [red, green, blue] = this._fillRGB;

    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    grad.addColorStop(0, `rgba(${red},${green},${blue},${this._paintOpacity})`);
    grad.addColorStop(1, `rgba(${red},${green},${blue},0)`);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  }

  toObject() {
    // Only {pX, pY} — geometry is reconstructed from the group's RNG seed
    return {
      pX: this.pX,
      pY: this.pY,
    };
  }

  static fromObject(object, options) {
    return super.fromObject(object, options);
  }
}

export default GraffitiParticle;

classRegistry.setClass(GraffitiParticle, 'graffitiParticle');
