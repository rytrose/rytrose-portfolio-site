import { classRegistry, BaseBrush, Point } from "fabric";
import Prando from "prando";
import { denormalizeToRange, quantize } from "../../normalize";
import { randomXY, randomRadius } from "../utils";
import GraffitiGroup from "./GraffitiGroup";
import GraffitiParticle from "./GraffitiParticle";

class GraffitiBrush extends BaseBrush {
  static type = "graffitiBrush";

  constructor(canvas, visitorRef, cursorRef, updatePaint) {
    super({
      type: GraffitiBrush.type,
      radius: 30,
      numParticles: 20,
      particleOpacity: 1,
      particleRadius: 1,
      particleRadiusDeviation: 0,
    });

    this.canvas = canvas;
    this.sprays = [];
    this.visitorRef = visitorRef;
    this.visitorID = visitorRef.current.id;
    this.cursorRef = cursorRef;
    this.updatePaint = updatePaint;
    this.seed = undefined;
    this.rng = undefined;
    this.painting = false;
    this.limitedToCanvasSize = true;
    this.last = { x: undefined, y: undefined };
  }

  setBrushSize(value) {
     // Don't update brush size if actively painting
    if (this.painting) return;

    const minRadius = 8;
    const maxRadius = 100;
    const radius = denormalizeToRange(value, minRadius, maxRadius);

    const minParticleRadius = 1.5;
    const maxParticleRadius = 2.5;
    const particleRadius = denormalizeToRange(
      value,
      maxParticleRadius,
      minParticleRadius
    );

    const minParticleRadiusDeviation = 0;
    const maxParticleRadiusDeviation = 12;
    const denormalizedParticleRadiusDeviation = denormalizeToRange(
      value,
      minParticleRadiusDeviation,
      maxParticleRadiusDeviation
    );
    let particleRadiusDeviation = 0;
    if (value < 0.5) {
      particleRadiusDeviation = denormalizedParticleRadiusDeviation;
    } else {
      particleRadiusDeviation =
        maxParticleRadiusDeviation - denormalizedParticleRadiusDeviation;
    }

    const minNumParticles = 6;
    const maxNumParticles = 40;
    const denormalizedNumParticles = denormalizeToRange(
      value,
      minNumParticles,
      maxNumParticles
    );
    const numParticles = quantize(
      denormalizedNumParticles,
      Array.from({ length: maxNumParticles }, (_, i) => i + 1)
    );

    const minParticleOpacity = 0.25;
    const maxParticleOpacity = 0.9;
    const particleOpacity = denormalizeToRange(
      value,
      maxParticleOpacity,
      minParticleOpacity
    );

    this.rawNormalizedBrushSize = value;
    this.radius = radius;
    this.particleRadius = particleRadius;
    this.particleRadiusDeviation = particleRadiusDeviation;
    this.numParticles = numParticles;
    this.particleOpacity = particleOpacity;

    // Re-render to update cursor size
    this.canvas.requestRenderAll();

    return radius;
  }

  onMouseDown(pointer) {
    // Reset sprays for new iteration
    this.sprays.length = 0;
    this.canvas.clearContext(this.canvas.contextTop);

    // TODO: callback to notify out of paint
    if (!this.canSpray()) {
      return;
    }

    // Mark painting
    this.painting = true;

    // Set RNG
    this.seed = `${this.visitorID}-${Date.now()}`;
    this.rng = new Prando(this.seed);

    // Off-screen canvas at scene scale. Particles accumulate here and are blitted
    // to contextTop via drawImage, matching Fabric's objectCaching compositing path
    // so live drawing appearance matches the rendered group after mouseup.
    const zoom = this.canvas.getZoom();
    const sceneW = Math.round(this.canvas.getWidth() / zoom);
    const sceneH = Math.round(this.canvas.getHeight() / zoom);
    this._strokeEl = document.createElement('canvas');
    this._strokeEl.width = sceneW;
    this._strokeEl.height = sceneH;
    this._strokeCtx = this._strokeEl.getContext('2d');

    // Create and persist new spray
    const spray = this.addSpray(pointer);

    // Render new spray as it is created
    this.render(spray);
  }

  onMouseMove(pointer) {
    if (
      !this.painting ||
      (this.limitedToCanvasSize === true && this._isOutSideCanvas(pointer))
    ) {
      return;
    }

    // TODO: callback to notify out of paint
    if (!this.canSpray()) {
      // Set paint to zero to display paint as fully run out
      this.updatePaint(0);
      // Don't allow painting to continue in this stroke if ran out of paint
      return;
    }

    // Lower fidelity on larger screens, with the added bonus of smaller
    // numbers for serialization size
    pointer = { x: +pointer.x.toFixed(2), y: +pointer.y.toFixed(2) };
    if (this.last.x === pointer.x && this.last.y === pointer.y) return;
    this.last = pointer;

    // Create and persist new spray
    const spray = this.addSpray(pointer);

    // Render new spray as it is created
    this.render(spray);
  }

  onMouseUp() {
    this.painting = false;
    this._strokeEl = null;
    this._strokeCtx = null;

    // Store and clear renderOnAddRemove
    const originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
    this.canvas.renderOnAddRemove = false;

    // Create objects to persist
    const particles = [];
    for (let i = 0; i < this.sprays.length; i++) {
      const spray = this.sprays[i];
      for (let j = 0; j < spray.length; j++) {
        const particle = new GraffitiParticle({
          pX: spray[j].pX,
          pY: spray[j].pY,
          radius: spray[j].radius,
          left: spray[j].x,
          top: spray[j].y,
          originX: "center",
          originY: "center",
          fill: this.color,
          opacity: this.particleOpacity,
        });
        particles.push(particle);
      }
    }

    if (particles.length === 0) return;

    // Add objects to group
    const group = new GraffitiGroup(particles, {
      visitorID: this.visitorID,
      seed: this.seed,
      rawNormalizedBrushSize: this.rawNormalizedBrushSize,
      brushRadius: this.radius,
      brushNumParticles: this.numParticles,
      particleOpacity: this.particleOpacity,
      particleRadius: this.particleRadius,
      particleRadiusDeviation: this.particleRadiusDeviation,
      // TODO: consider passing array of spray numParticles
      // to add RNG to numParticles
      color: this.color,
    });

    // Add to canvas
    this.canvas.add(group);

    // Render objects
    this.canvas.clearContext(this.canvas.contextTop);
    this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
    this.canvas.requestRenderAll();
  }

  render(spray) {
    // Accumulate spray particles onto the off-screen stroke canvas at scene coordinates
    const sCtx = this._strokeCtx;
    sCtx.globalAlpha = this.particleOpacity;
    sCtx.fillStyle = this.color;
    for (const point of spray) {
      sCtx.beginPath();
      sCtx.arc(point.x, point.y, point.radius, 0, Math.PI * 2, false);
      sCtx.closePath();
      sCtx.fill();
    }
    // Blit to contextTop with viewport transform — same compositing path as objectCaching
    const ctx = this.canvas.contextTop;
    this.canvas.clearContext(ctx);
    this._saveAndTransform(ctx);
    ctx.drawImage(this._strokeEl, 0, 0);
    ctx.restore();
  }

  _render() {
    if (this._strokeEl) {
      const ctx = this.canvas.contextTop;
      this.canvas.clearContext(ctx);
      this._saveAndTransform(ctx);
      ctx.drawImage(this._strokeEl, 0, 0);
      ctx.restore();
    }
  }

  _isOutSideCanvas(pointer) {
    const zoom = this.canvas.getZoom();
    const sceneWidth = this.canvas.getWidth() / zoom;
    const sceneHeight = this.canvas.getHeight() / zoom;
    return pointer.x < 0 || pointer.x > sceneWidth || pointer.y < 0 || pointer.y > sceneHeight;
  }

  addSpray(pointer) {
    const particles = [];
    let paint = 0;
    for (let i = 0; i < this.numParticles; i++) {
      const { x, y } = randomXY(
        pointer,
        this.radius,
        this.rng.next(),
        this.rng.next()
      );
      let point = new Point(x, y);
      point.radius = randomRadius(
        this.particleRadius,
        this.particleRadiusDeviation,
        this.rng.next()
      );
      paint += Math.PI * Math.pow(point.radius, 2);
      point.pX = pointer.x;
      point.pY = pointer.y;
      particles.push(point);
    }
    this.sprays.push(particles);
    this.deductPaint(paint);
    return particles;
  }

  // Due to RNG in how much paint a single spray actually uses,
  // compute the maximum amount of paint per spray to check against
  // when determining if the visitor is out of paint.
  maxPaintPerSpray() {
    return (
      this.numParticles *
      (Math.PI *
        Math.pow(this.particleRadius + this.particleRadiusDeviation, 2))
    );
  }

  canSpray() {
    return this.visitorRef.current.paint > this.maxPaintPerSpray();
  }

  deductPaint(paint) {
    this.updatePaint(this.visitorRef.current.paint - paint);
  }
}

export default GraffitiBrush;

classRegistry.setClass(GraffitiBrush, 'graffitiBrush');
