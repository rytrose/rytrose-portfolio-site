import { fabric } from "fabric";

export const GraffitiGroup = fabric.util.createClass(fabric.Group, {
  type: "graffitiGroup",
  initialize: function (objects, options) {
    options || (options = {});

    this.callSuper("initialize", objects, options);
    this.set("visitorID", options.visitorID || "");
  },
  toObject: function () {
    const { type, version, left, top, width, height, fill, opacity, objects } =
      this.callSuper("toObject");
    const subset = {
      type,
      version,
      left,
      top,
      width,
      height,
      fill,
      opacity,
      objects,
    };
    return {
      ...subset,
      visitorID: this.get("visitorID"),
    };
  },
  hasControls: false,
  selectable: false,
  hoverCursor: "auto",
});

export const GraffitiParticle = fabric.util.createClass(fabric.Circle, {
  type: "graffitiParticle",
  initialize: function (options) {
    options || (options = {});

    this.callSuper("initialize", options);
  },
  toObject: function () {
    return this.callSuper("toObject");
  },
  selectable: false,
  hoverCursor: "auto",
});

/*
  TODO: 
  - import https://github.com/zeh/prando
  - create a brush like SprayBrush http://fabricjs.com/docs/fabric.js.html#line11222
  - store path of cursor in Group
  - render spray using deterministic PRNG seeded by ? (visitor ID + time?)
  - implement deserialization from path of cursor and PRNG seed
*/
