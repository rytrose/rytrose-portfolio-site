import { fabric } from "fabric";
import { useEffect, useRef, useCallback } from "react";
import useResizeObserver from "use-resize-observer";
import useFabric from "../../hooks/useFabric";

const GraffitiCanvas = () => {
  const { canvasElRef, fabricCanvasRef } = useFabric({
    selection: false,
  });
  const divRef = useRef();

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
      selectable: false,
      hoverCursor: "auto",
    });
    canvas.add(circle);

    /*
      TODO:
        - On touchdown/clickdown create Group size == canvas
        - On drage, use canvas position to spawn circles/shapes "paint", add to Group
        - Subtract area of painted shapes from user's available "paint"
        - Stop adding when touchup or user is out of "paint"
    */
  }, [fabricCanvasRef]);

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
