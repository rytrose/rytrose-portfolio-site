import { classRegistry, Circle, FabricObject } from "fabric";

class GraffitiParticle extends Circle {
  static type = "graffitiParticle";

  constructor(options = {}) {
    super({
      ...options,
      selectable: false,
      hoverCursor: "auto"
    });

    this.pX = options.pX || 0;
    this.pY = options.pY || 0;
  }

  toObject() {
    // Must reconstruct from rng
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
