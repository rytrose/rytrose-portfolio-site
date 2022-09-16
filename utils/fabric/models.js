import { fabric } from "fabric";
import Prando from "prando";

export const GraffitiGroup = fabric.util.createClass(fabric.Group, {
  type: "graffitiGroup",
  initialize: function (objects, options) {
    options || (options = {});

    this.callSuper("initialize", objects, options);
    this.set("visitorID", options.visitorID || "");
    this.set("seed", options.seed || "");
    this.set("brushWidth", options.brushWidth || 10);
    this.set("brushDensity", options.brushDensity || 10);
    this.set("color", options.color || "rgb(0,0,0)");
  },
  toObject: function () {
    const { type, version, left, top, width, height, fill, opacity, objects } =
      this.callSuper("toObject");
    const reducedObjects = objects.reduce((reduced, current) => {
      if (reduced.length === 0) return [current];
      const last = reduced.at(-1);
      if (current.pX !== last.pX || current.pY !== last.pY) {
        return [...reduced, current];
      }
      return reduced;
    }, []);
    const subset = {
      type,
      // WARNING: dropped "version" for size, may break things in future
      // versions of fabric, but as of 5.2.4 it's only used in exporting to
      // SVG, so if we don't do that, all is well.
      left,
      top,
      width,
      height,
      fill,
    };
    return {
      visitorID: this.get("visitorID"),
      seed: this.get("seed"),
      brushWidth: this.get("brushWidth"),
      brushDensity: this.get("brushDensity"),
      color: this.get("color"),
      objects: reducedObjects,
      ...subset,
    };
  },
  hasControls: false,
  selectable: false,
  hoverCursor: "auto",
});
fabric.GraffitiGroup = GraffitiGroup;
fabric.GraffitiGroup.fromObject = function (object, callback) {
  // TODO: reconstruct object.objects
  // Reconstruct type, version, left, top, fill, opacity, radius
  const reconstructedObjects = [];

  const rng = new Prando(object.seed);
  object.objects.forEach((spray) => {
    for (let i = 0; i < object.brushDensity; i++) {
      reconstructedObjects.push({
        type: "graffitiParticle",
        version: "5.2.4", // TODO: figure out what to do with version
        left: rng.nextInt(
          spray.pX - object.brushWidth / 2,
          spray.pX + object.brushWidth / 2
        ),
        top: rng.nextInt(
          spray.pY - object.brushWidth / 2,
          spray.pY + object.brushWidth / 2
        ),
        fill: object.color,
        radius: 1, // TODO: fix and/or use RNG
        ...spray,
      });
    }
  });

  fabric.util.enlivenObjects(reconstructedObjects, function (enlivenedObjects) {
    delete object.objects;
    callback(
      new fabric.GraffitiGroup(enlivenedObjects, {
        visitorID: object.visitorID,
        seed: object.seed,
        brushWidth: object.brushWidth,
        brushDensity: object.brushDensity,
        color: object.color,
        ...object,
      })
    );
  });
};

export const GraffitiParticle = fabric.util.createClass(fabric.Circle, {
  type: "graffitiParticle",
  initialize: function (options) {
    options || (options = {});

    this.callSuper("initialize", options);
    this.set("pX", options.pX || 0);
    this.set("pY", options.pY || 0);
  },
  toObject: function () {
    // Must reconstruct from RNG
    return {
      pX: this.get("pX"),
      pY: this.get("pY"),
    };
  },
  selectable: false,
  hoverCursor: "auto",
});
fabric.GraffitiParticle = GraffitiParticle;
fabric.GraffitiParticle.fromObject = function (object, callback) {
  return fabric.Object._fromObject("GraffitiParticle", object, callback);
};

/*
  TODO: 
  - import https://github.com/zeh/prando
  - create a brush like SprayBrush http://fabricjs.com/docs/fabric.js.html#line11222
  - store path of cursor in Group
  - render spray using deterministic PRNG seeded by ? (visitor ID + time?)
  - implement deserialization from path of cursor and PRNG seed
*/

export const GraffitiBrush = fabric.util.createClass(fabric.BaseBrush, {
  type: "graffitiBrush",

  // TODO: consider making radius and have shape be circle
  width: 10,

  // TODO: consider making configurable
  density: 20,

  // TODO: add random sizing
  particleRadius: 1,

  initialize: function (canvas, visitorID) {
    this.canvas = canvas;
    this.visitorID = visitorID;
    this.sprays = [];
    this.seed = undefined;
    this.rng = undefined;
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
    for (const i = 0; i < this.sprays.length; i++) {
      const spray = this.sprays[i];
      for (const j = 0; j < spray.length; j++) {
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
      brushWidth: this.width,
      brushDensity: this.density,
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
    for (const i = 0; i < spray.length; i++) {
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
    for (const i = 0; i < this.sprays.length; i++) {
      this.render(this.sprays[i]);
    }
    ctx.restore();
  },

  addSpray: function (pointer) {
    pointer.x = +pointer.x.toFixed(2);
    pointer.y = +pointer.y.toFixed(2);
    const particles = [];
    for (const i = 0; i < this.density; i++) {
      const x = this.rng.nextInt(
        pointer.x - this.width / 2,
        pointer.x + this.width / 2
      );
      const y = this.rng.nextInt(
        pointer.y - this.width / 2,
        pointer.y + this.width / 2
      );
      let point = new fabric.Point(x, y);
      point.radius = this.particleRadius;
      point.pX = pointer.x;
      point.pY = pointer.y;
      particles.push(point);
    }
    this.sprays.push(particles);
    return particles;
  },
});
