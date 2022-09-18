import { fabric } from "fabric";
import Prando from "prando";
import { randomXY, randomRadius } from "../utils";
import GraffitiGroup from "./GraffitiGroup";
import GraffitiParticle from "./GraffitiParticle";

const GraffitiBrush = fabric.util.createClass(fabric.BaseBrush, {
  type: "graffitiBrush",

  // TODO: Make radius and density configurable and inversely proportional,
  // removing density as a property
  radius: 30,
  density: 20,

  particleOpacity: 1,
  particleRadius: 1,
  particleRadiusDeviation: 0,

  initialize: function (
    canvas,
    visitorRef,
    cursorRef,
    updatePaint,
    setLastPainted
  ) {
    this.canvas = canvas;
    this.sprays = [];
    this.visitorRef = visitorRef;
    this.visitorID = visitorRef.current.id;
    this.cursorRef = cursorRef;
    this.updatePaint = updatePaint;
    this.setLastPainted = setLastPainted;
    this.seed = undefined;
    this.rng = undefined;
    this.painting = false;
    this.last = { x: undefined, y: undefined };
  },

  onMouseDown: function (pointer) {
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

    // Create and persist new spray
    const spray = this.addSpray(pointer);

    // Render new spray as it is created
    this.render(spray);
  },

  onMouseMove: function (pointer) {
    if (
      !this.painting ||
      (this.limitedToCanvasSize === true && this._isOutSideCanvas(pointer))
    ) {
      return;
    }

    // TODO: callback to notify out of paint
    if (!this.canSpray()) {
      // Don't allow painting to continue in this stroke if ran out of paint
      this.painting = false;
      // Set paint to zero to display paint as fully run out
      this.updatePaint(0);
      // Set last painted time to update paint refill
      this.setLastPainted();
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
  },

  onMouseUp: function () {
    this.painting = false;
    this.setLastPainted();

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
      brushRadius: this.radius,
      brushDensity: this.density,
      particleOpacity: this.particleOpacity,
      particleRadius: this.particleRadius,
      particleRadiusDeviation: this.particleRadiusDeviation,
      // TODO: consider passing array of spray densities
      // to add RNG to density
      color: this.color,
    });

    // Add to canvas
    this.canvas.add(group);

    // Render objects
    this.canvas.clearContext(this.canvas.contextTop);
    this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
    this.canvas.requestRenderAll();
  },

  particle: function (ctx, point) {
    ctx.globalAlpha = this.particleOpacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  },

  render: function (spray) {
    const ctx = this.canvas.contextTop;
    ctx.fillStyle = this.color;
    this._saveAndTransform(ctx);
    for (let i = 0; i < spray.length; i++) {
      const point = spray[i];
      this.particle(ctx, point);
    }
    ctx.restore();
  },

  _render: function () {
    const ctx = this.canvas.contextTop;
    ctx.fillStyle = this.color;
    this._saveAndTransform(ctx);
    for (let i = 0; i < this.sprays.length; i++) {
      this.render(this.sprays[i]);
    }
    ctx.restore();
  },

  addSpray: function (pointer) {
    const particles = [];
    let paint = 0;
    for (let i = 0; i < this.density; i++) {
      const { x, y } = randomXY(
        pointer,
        this.radius,
        this.rng.next(),
        this.rng.next()
      );
      let point = new fabric.Point(x, y);
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
  },

  maxPaintPerSpray: function () {
    return (
      this.density *
      (Math.PI *
        Math.pow(this.particleRadius + this.particleRadiusDeviation, 2))
    );
  },

  canSpray: function () {
    return this.visitorRef.current.paint > this.maxPaintPerSpray();
  },

  deductPaint: function (paint) {
    this.updatePaint(this.visitorRef.current.paint - paint);
  },
});

export default GraffitiBrush;
