import { fabric } from "fabric";

const GraffitiGroup = fabric.util.createClass(fabric.Group, {
  type: "graffitiGroup",
  initialize: function (options) {
    options || (options = {});

    this.callSuper("initialize", options);
    this.set("visitorID", options.visitorID || "");
  },
  toObject: function () {
    return fabric.util.object.extend(this.callSuper("toObject"), {
      visitorID: this.get("visitorID"),
    });
  },
});

export default GraffitiGroup;
