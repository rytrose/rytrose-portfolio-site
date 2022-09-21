import { fabric } from "fabric";
import Prando from "prando";
import { randomXY, randomRadius } from "../utils";

const GraffitiGroup = fabric.util.createClass(fabric.Group, {
  type: "graffitiGroup",
  hasControls: false,
  selectable: false,
  hoverCursor: "auto",
  initialize: function (objects, options) {
    options || (options = {});

    this.callSuper("initialize", objects, options);
    this.set("visitorID", options.visitorID || "");
    this.set("seed", options.seed || "");
    this.set("brushRadius", options.brushRadius || 10);
    this.set("brushDensity", options.brushDensity || 10);
    this.set("particleOpacity", options.particleOpacity || 1);
    this.set("particleRadius", options.particleRadius || 1);
    this.set("particleRadiusDeviation", options.particleRadiusDeviation || 0);
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
      particleOpacity: this.get("particleOpacity"),
      particleRadius: this.get("particleRadius"),
      particleRadiusDeviation: this.get("particleRadiusDeviation"),
      color: this.get("color"),
      objects: reducedObjects,
      ...subset,
    };
  },
  computePaint: function () {
    let paint = 0;
    for (let particle of this._objects) {
      paint += Math.PI * Math.pow(particle.radius, 2);
    }
    return paint;
  },
});
fabric.GraffitiGroup = GraffitiGroup;
fabric.GraffitiGroup.fromObject = function (object, callback) {
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
        opacity: object.particleOpacity,
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
      particleOpacity: object.particleOpacity,
      particleRadius: object.particleRadius,
      particleRadiusDeviation: object.particleRadiusDeviation,
      color: object.color,
      ...object,
    });
    callback(group);
  });
};

export default GraffitiGroup;
