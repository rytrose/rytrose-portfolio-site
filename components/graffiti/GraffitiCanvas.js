import { fabric } from "fabric";
import { useEffect, useRef, useCallback, useState } from "react";
import useResizeObserver from "use-resize-observer";
import useFabric from "../../hooks/useFabric";
import GraffitiGroup from "../../utils/fabric/models";

const GraffitiCanvas = () => {
  const { canvasElRef, fabricCanvasRef } = useFabric({
    selection: false,
  });
  const divRef = useRef();
  const paintingRef = useRef(false);
  const groupRef = useRef();

  // TODO: FIX
  fabric.Group.prototype.hasControls = false;
  fabric.Group.prototype.selectable = false;
  fabric.Group.prototype.hoverCursor = "auto";

  // onDivResize resizes the canvas responsively
  const onDivResize = useCallback(
    (size) => {
      if (!size) return;
      if (!fabricCanvasRef.current) return;
      const canvas = fabricCanvasRef.current;

      const ratio = canvas.getWidth() / canvas.getHeight();
      const containerWidth = size.width;
      const containerHeight = size.height;
      const maxWidthHeight = containerWidth / ratio;
      let scale, zoom, width, height;

      // If setting the height to max width would make it taller than the container,
      // use the container height instead to prevent scrolling.
      if (maxWidthHeight > containerHeight) {
        scale = containerHeight / canvas.getHeight();
        zoom = canvas.getZoom() * scale;
        width = containerHeight * ratio;
        height = containerHeight;
      } else {
        // Set the canvas to max width
        scale = containerWidth / canvas.getWidth();
        zoom = canvas.getZoom() * scale;
        width = containerWidth;
        height = containerWidth / ratio;
      }
      canvas.setDimensions({
        width: width,
        height: height,
      });
      canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
    },
    [fabricCanvasRef]
  );

  useResizeObserver({
    ref: divRef,
    onResize: onDivResize,
  });

  // Sets up all things for the canvas
  // TODO: refactor into custom hook
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    const circle = new fabric.Circle({
      originX: "center",
      originY: "center",
      radius: 50,
      fill: "green",
      hasControls: false,
      selectable: false,
      hoverCursor: "auto",
    });
    canvas.add(circle);

    canvas.on("mouse:down", (options) => {
      // Check if paint available

      // Create new group
      const group = new GraffitiGroup([], {
        top: 0,
        left: 0,
        hasControls: false,
        selectable: false,
        hoverCursor: "auto",
        visitorID: "TODO: implement",
      });
      groupRef.current = group;

      // Start painting
      paintingRef.current = true;
    });

    canvas.on("mouse:move", (event) => {
      // Check if painting
      if (!paintingRef.current) return;

      // Check if paint available

      // Sanity check group exists
      if (!groupRef.current) return;
      const group = groupRef.current;

      // Check last paint time
      if (Math.random() > 0.8) return;

      // Create paint
      const paint = new fabric.Circle({
        left: event.pointer.x,
        top: event.pointer.y,
        radius: 5 + Math.floor(Math.random() * 10),
        fill: "blue",
        originX: "center",
        originY: "center",
        selectable: false,
        hoverCursor: "auto",
      });

      // Add paint to group
      group.addWithUpdate(paint, {
        left: event.pointer.x,
        top: event.pointer.y,
      });
      canvas.add(group);
    });

    canvas.on("mouse:up", (options) => {
      // Check if was painting
      if (!paintingRef.current) return;
      // Stop painting
      paintingRef.current = false;
      // Serialize canvas
      // Send canvas to audio pipeline
      // Post update to canvas
    });

    canvas.on("mouse:out", (options) => {
      // Check if was painting
      // Stop painting
    });

    /*
      TODO:
        - On touchdown/clickdown create Group size == canvas
        - On drage, use canvas position to spawn circles/shapes "paint", add to Group
        - Subtract area of painted shapes from user's available "paint"
        - Stop adding when touchup or user is out of "paint"
    */
  }, [fabricCanvasRef, paintingRef, groupRef]);

  return (
    <div
      ref={divRef}
      className="flex justify-center sm:h-[100vh] sm:max-h-[calc(100vh-162px)]"
    >
      <canvas
        className="border border-slate-200"
        ref={canvasElRef}
        width={500}
        height={500}
      />
    </div>
  );
};

export default GraffitiCanvas;
