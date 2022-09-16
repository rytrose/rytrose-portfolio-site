import { fabric } from "fabric";
import Prando from "prando";

export const GraffitiGroup = fabric.util.createClass(fabric.Group, {
  type: "graffitiGroup",
  initialize: function (objects, options) {
    options || (options = {});

    this.callSuper("initialize", objects, options);
    this.set("visitorID", options.visitorID || "");
    this.set("seed", options.seed || "");
    this.set("brushRadius", options.brushRadius || 10);
    this.set("brushDensity", options.brushDensity || 10);
    this.set("particleRadius", options.particleRadius || 1);
    this.set("particleRadiusDeviation", options.particleRadiusDeviation || 5);
    this.set("color", options.color || "rgb(0,0,0)");
  },
  toObject: function () {
    const { type, left, top, width, height, fill, objects } =
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
      brushRadius: this.get("brushRadius"),
      brushDensity: this.get("brushDensity"),
      particleRadius: this.get("particleRadius"),
      particleRadiusDeviation: this.get("particleRadiusDeviation"),
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
      const { x, y } = randomXY(
        { x: spray.pX, y: spray.pY },
        object.brushRadius,
        rng.next(),
        rng.next()
      );
      reconstructedObjects.push({
        type: "graffitiParticle",
        version: "5.2.4", // TODO: figure out what to do with version
        left: x,
        top: y,
        fill: object.color,
        radius: randomRadius(
          object.particleRadius,
          object.particleRadiusDeviation,
          rng.next()
        ),
        ...spray,
      });
    }
  });

  fabric.util.enlivenObjects(reconstructedObjects, function (enlivenedObjects) {
    delete object.objects;
    const group = new fabric.GraffitiGroup(enlivenedObjects, {
      visitorID: object.visitorID,
      seed: object.seed,
      brushRadius: object.brushRadius,
      brushDensity: object.brushDensity,
      particleRadius: object.particleRadius,
      particleRadiusDeviation: object.particleRadiusDeviation,
      color: object.color,
      ...object,
    });
    callback(group);
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
    const particles = [];
    for (const i = 0; i < this.density; i++) {
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

const randomXY = (pointer, radius, rn1, rn2) => {
  const r = radius * Math.sqrt(rn1);
  const theta = rn2 * 2 * Math.PI;
  return {
    x: pointer.x + r * Math.cos(theta),
    y: pointer.y + r * Math.sin(theta),
  };
};

const randomRadius = (r, variation, rn) => {
  return r + variation * rn;
};
