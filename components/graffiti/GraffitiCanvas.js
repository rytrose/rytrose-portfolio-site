import { fabric } from "fabric";
import { useEffect, useRef, useCallback, useMemo } from "react";
import useResizeObserver from "use-resize-observer";
import useFabric from "../../hooks/useFabric";
import useVisitor from "../../hooks/useVisitor";
import GraffitiBrush from "../../utils/fabric/models/GraffitiBrush";

const MAX_PAINT = 90000;

const GraffitiCanvas = () => {
  // Ref for the div containing the canvas
  const divRef = useRef();
  // Ref for the visitor's current paint level
  const paintRef = useRef();
  // Visior state
  const [visitor, visitorDispatch] = useVisitor();
  // Options for the fabric canvas. Must be memoized otherwise
  const fabricOptions = useMemo(
    () => ({
      selection: false,
    }),
    []
  );
  const [canvasElRef, fabricCanvasRef] = useFabric(fabricOptions);

  // Resizes the canvas responsively.
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

  // Calls the canvas resizing callback whenever the canvas
  // div's size changes.
  useResizeObserver({
    ref: divRef,
    onResize: onDivResize,
  });

  // Whenever the visitor.paint state changes, update the ref
  // so the fabric objects can read the current state.
  useEffect(() => {
    let paint = visitor?.paint;
    if (paint === -1) {
      paint = MAX_PAINT;
      visitorDispatch({ type: "setPaint", paint: MAX_PAINT });
    }
    paintRef.current = paint;
  }, [visitor.paint, paintRef, visitorDispatch]);

  // Sets up the canvas event handlers.
  useEffect(() => {
    // Setup canvas
    const canvas = fabricCanvasRef.current;

    // Setup fabric event handlers
    canvas.on("mouse:up", (_) => {
      // Serialize canvas
      const serializedCanvas = JSON.stringify(canvas);
      setTimeout(() => {
        canvas.clear();
      }, 1000);

      setTimeout(() => {
        canvas.loadFromJSON(serializedCanvas);
      }, 2000);

      // Send canvas to audio pipeline
      // Post update to canvas
    });
  }, [fabricCanvasRef]);

  // Dispatches an update to visitor.paint, to be used in the
  // fabric objects.
  const updatePaint = useCallback(
    (paint) => {
      visitorDispatch({ type: "setPaint", paint: paint });
    },
    [visitorDispatch]
  );

  // Sets up the graffiti brush.
  useEffect(() => {
    if (typeof visitor.id === "undefined") return;
    const canvas = fabricCanvasRef.current;
    const brush = new GraffitiBrush(canvas, visitor.id, paintRef, updatePaint);
    window.brush = brush;
    brush.radius = 10;
    brush.color = "green";
    brush.density = 4;
    brush.particleOpacity = 0.5;
    brush.particleRadiusDeviation = 6;
    canvas.freeDrawingBrush = brush;
    canvas.isDrawingMode = true;
  }, [fabricCanvasRef, paintRef, visitor.id, updatePaint]);

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
