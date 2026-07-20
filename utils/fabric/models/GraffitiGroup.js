import { FabricObject, Group, classRegistry } from "fabric";
import Prando from "prando";
import { randomXY, randomXYGaussian, randomRadius } from "../utils";

class GraffitiGroup extends Group {
  static type = "graffitiGroup";

  constructor(objects, options = {}) {
    super(objects, {
      ...options,
      hasControls: false,
      selectable: false,
      hoverCursor: "auto",
    });

    this.visitorID = options.visitorID || "";
    this.seed = options.seed || "";
    this.brushRadius = options.brushRadius || 10;
    this.brushNumParticles = options.brushNumParticles || 10;
    this.particleOpacity = options.particleOpacity || 1;
    this.paintOpacity = options.paintOpacity ?? options.particleOpacity ?? 1;
    this.particleRadius = options.particleRadius || 1;
    this.particleRadiusDeviation = options.particleRadiusDeviation || 0;
    this.color = options.color || "rgb(0,0,0)";
    this.gaussianDistribution = options.gaussianDistribution || false;
  }

  toObject() {
    const object = super.toObject();
    const reducedObjects = object.objects.reduce((reduced, current) => {
      if (reduced.length === 0) return [current];
      const last = reduced.at(-1);
      if (current.pX !== last.pX || current.pY !== last.pY) {
        return [...reduced, current];
      }
      return reduced;
    }, []);
    const toObject = {
      visitorID: this.visitorID,
      seed: this.seed,
      brushRadius: this.brushRadius,
      brushNumParticles: this.brushNumParticles,
      particleOpacity: this.particleOpacity,
      paintOpacity: this.paintOpacity,
      particleRadius: this.particleRadius,
      particleRadiusDeviation: this.particleRadiusDeviation,
      color: this.color,
      gaussianDistribution: this.gaussianDistribution,
      objects: reducedObjects,
      // WARNING: dropped "version" for size, may break things in future
      // versions of fabric, but as of 5.2.4 it's only used in exporting to
      // SVG, so if we don't do that, all is well.
      type: object.type,
      left: object.left,
      top: object.top,
      width: object.width,
      height: object.height,
      fill: object.fill,
      originX: object.originX,
      originY: object.originY
    };
    return toObject;
  }

  computePaint() {
    let paint = 0;
    for (let particle of this._objects) {
      paint += Math.PI * Math.pow(particle.radius, 2);
    }
    return paint;
  }

  static fromObject(object) {
    const reconstructedObjects = [];
    const rng = new Prando(object.seed);
    // In Fabric v6 the default originX was "left", so left/top were the bounding box edges.
    // In Fabric v7 the default changed to "center", so left/top are the bounding box center.
    // Old data has no originX stored (undefined → treat as "left"); new data stores it explicitly.
    const isCenterOrigin = object.originX === "center";
    const groupCenterX = isCenterOrigin ? object.left : object.left + object.width / 2;
    const groupCenterY = isCenterOrigin ? object.top : object.top + object.height / 2;

    // Select distribution: new groups use Gaussian (denser center), old groups keep uniform
    const positionFn = object.gaussianDistribution ? randomXYGaussian : randomXY;

    // New groups have paintOpacity; old groups only have particleOpacity (the Fabric opacity)
    const isNewGroup = object.paintOpacity !== undefined;

    object.objects.forEach((spray) => {
      for (let i = 0; i < object.brushNumParticles; i++) {
        const { x, y } = positionFn(
          { x: spray.pX, y: spray.pY },
          object.brushRadius,
          rng.next(),
          rng.next()
        );
        reconstructedObjects.push({
          type: "graffitiParticle",
          version: "6.9.0",
          originX: "center",
          originY: "center",
          left: x - groupCenterX,
          top: y - groupCenterY,
          fill: object.color,
          // New groups: Fabric opacity stays 1, paintOpacity carries the alpha into the gradient.
          // Old groups: opacity is set to particleOpacity so the particle constructor fallback works.
          opacity: isNewGroup ? 1 : object.particleOpacity,
          paintOpacity: isNewGroup ? object.paintOpacity : undefined,
          radius: randomRadius(
            object.particleRadius,
            object.particleRadiusDeviation,
            rng.next()
          ),
          ...spray,
        });
      }
    });

    const group = super.fromObject({
      ...object,
      type: GraffitiGroup.type,
      objects: reconstructedObjects
    });
    return group;
  }

};

export default GraffitiGroup;

classRegistry.setClass(GraffitiGroup, 'graffitiGroup');
