import { fabric } from "fabric";
import { useEffect, useRef, useCallback, useState } from "react";
import useResizeObserver from "use-resize-observer";
import useFabric from "../../hooks/useFabric";
import {
  GraffitiBrush,
  GraffitiGroup,
  GraffitiParticle,
} from "../../utils/fabric/models";

const GraffitiCanvas = () => {
  const { canvasElRef, fabricCanvasRef } = useFabric({
    selection: false,
  });
  const divRef = useRef();
  const paintingRef = useRef(false);
  const groupRef = useRef();

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
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush = new GraffitiBrush(canvas, "TODO: implement");

    canvas.on("mouse:up", (_) => {
      // Serialize canvas
      const serializedCanvas = JSON.stringify(canvas);
      setTimeout(() => {
        canvas.clear();
      }, 1000);

      setTimeout(() => {
        // TODO: figure out why this is messed up
        console.log("loading from serialized");
        canvas.loadFromJSON(serializedCanvas);
        console.log(serializedCanvas);
      }, 2000);

      // Send canvas to audio pipeline
      // Post update to canvas
    });
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
