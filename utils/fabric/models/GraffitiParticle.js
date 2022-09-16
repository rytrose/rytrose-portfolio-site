import { fabric } from "fabric";

const GraffitiParticle = fabric.util.createClass(fabric.Circle, {
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

export default GraffitiParticle;
