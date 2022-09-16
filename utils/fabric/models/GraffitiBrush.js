import { fabric } from "fabric";
import Prando from "prando";
import { randomXY, randomRadius } from "../utils";
import GraffitiGroup from "./GraffitiGroup";
import GraffitiParticle from "./GraffitiParticle";

const GraffitiBrush = fabric.util.createClass(fabric.BaseBrush, {
  type: "graffitiBrush",

  radius: 30,

  // TODO: consider making configurable
  density: 20,

  particleRadius: 1,

  particleRadiusDeviation: 5,

  initialize: function (canvas, visitorID) {
    this.canvas = canvas;
    this.visitorID = visitorID;
    this.sprays = [];
    this.seed = undefined;
    this.rng = undefined;
    this.last = { x: undefined, y: undefined };
  },

  onMouseDown: function (pointer) {
    // Reset sprays for new interation
    this.sprays.length = 0;
    this.canvas.clearContext(this.canvas.contextTop);

    // Set RNG
    this.seed = `${this.visitorID}${Date.now()}`;
    this.rng = new Prando(this.seed);

    // Create and persist new spray
    const spray = this.addSpray(pointer);

    // Render new spray as it is created
    this.render(spray);
  },

  onMouseMove: function (pointer) {
    if (this.limitedToCanvasSize === true && this._isOutSideCanvas(pointer)) {
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
        });
        particles.push(particle);
      }
    }

    // Add objects to group
    const group = new GraffitiGroup(particles, {
      visitorID: this.visitorID,
      seed: this.seed,
      brushRadius: this.radius,
      brushDensity: this.density,
      particleRadius: this.particleRadius,
      particleRadiusDeviation: this.particleRadiusDeviation,
      // TODO: consider passing array of spray densities
      // to add RNG to density
      color: this.color,
    });

    // Fire events and add to canvas
    this.canvas.fire("before:path:created", { path: group });
    this.canvas.add(group);
    this.canvas.fire("path:created", { path: group });

    // Render objetcts
    this.canvas.clearContext(this.canvas.contextTop);
    this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
    this.canvas.requestRenderAll();
  },

  particle: function (ctx, point) {
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
      if (typeof point.opacity !== "undefined") {
        ctx.globalAlpha = point.opacity;
      }
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
      point.pX = pointer.x;
      point.pY = pointer.y;
      particles.push(point);
    }
    this.sprays.push(particles);
    return particles;
  },
});

export default GraffitiBrush;
