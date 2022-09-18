import { fabric } from "fabric";
import { useEffect, useRef, useCallback, useMemo } from "react";
import useResizeObserver from "use-resize-observer";
import useFabric from "../../hooks/useFabric";
import useVisitor from "../../hooks/useVisitor";
import GraffitiBrush from "../../utils/fabric/models/GraffitiBrush";
import ProgressBar from "../ProgressBar";

const MAX_PAINT = 40000;
// const TOTAL_REFILL_TIME_MS = 24 * 60 * 60 * 1000; // 24 hours
const TOTAL_REFILL_TIME_MS = 30 * 1000; // 10 seconds
const REFILL_INTERVAL_MS = 1000 / 60;

const GraffitiCanvas = () => {
  // Ref for the div containing the canvas
  const divRef = useRef();
  // Visior state
  const [visitor, visitorRef, visitorDispatch] = useVisitor();

  // Options for the fabric canvas. Must be memoized otherwise
  const fabricOptions = useMemo(
    () => ({
      isDrawingMode: true,
      freeDrawingCursor: "none",
    }),
    []
  );
  const [canvasElRef, fabricCanvasRef] = useFabric(fabricOptions);
  const cursorRef = useRef(
    new fabric.Circle({
      // Start cursor off-screen
      left: -100,
      top: -100,
      radius: 0,
      fill: undefined,
      stroke: "rgb(226,232,240)",
      originX: "center",
      originY: "center",
    })
  );

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

  // Update unset paint to max paint.
  useEffect(() => {
    let paint = visitor?.paint;
    if (paint === -1) {
      paint = MAX_PAINT;
      visitorDispatch({ type: "setPaint", paint: MAX_PAINT });
    }
  }, [visitor.paint, visitorDispatch]);

  // Sets up the canvas event handlers.
  useEffect(() => {
    // Setup canvas
    const canvas = fabricCanvasRef.current;
    canvas.add(cursorRef.current);

    // Setup fabric event handlers
    canvas.on("mouse:up", (_) => {
      // Serialize canvas
      const serializedCanvas = JSON.stringify(canvas);
      // setTimeout(() => {
      //   canvas.clear();
      // }, 1000);

      // setTimeout(() => {
      //   canvas.loadFromJSON(serializedCanvas);
      // }, 2000);

      // Send canvas to audio pipeline
      // Post update to canvas
    });

    canvas.on("mouse:move", (event) => {
      const cursor = cursorRef.current;
      const { x, y } = canvas.getPointer(event.e);
      cursor
        .set({
          left: x,
          top: y,
        })
        .setCoords();
      canvas.bringToFront(cursor);
      canvas.requestRenderAll();
    });

    canvas.on(
      "mouse:out",
      (_) => {
        const cursor = cursorRef.current;
        cursor
          .set({
            left: -100,
            top: -100,
          })
          .setCoords();
        canvas.renderAll();
      },
      [fabricCanvasRef, cursorRef]
    );
  }, [fabricCanvasRef, cursorRef, visitorRef, visitorDispatch]);

  // Dispatches an update to visitor.paint, to be used in the
  // fabric objects.
  const updatePaint = useCallback(
    (paint) => {
      visitorDispatch({ type: "setPaint", paint: paint });
    },
    [visitorDispatch]
  );

  const setLastPainted = useCallback(() => {
    visitorDispatch({
      type: "setLastPainted",
      lastPainted: {
        t: new Date().getTime(),
        paint: visitorRef.current.paint,
      },
    });
  }, [visitorRef, visitorDispatch]);

  // Sets up the graffiti brush.
  useEffect(() => {
    if (typeof visitor.id === "undefined") return;
    const canvas = fabricCanvasRef.current;
    const brush = new GraffitiBrush(
      canvas,
      visitorRef,
      cursorRef,
      updatePaint,
      setLastPainted
    );
    window.brush = brush;
    brush.radius = 10;
    cursorRef.current.set({ radius: 10 });
    brush.color = "green";
    brush.density = 4;
    brush.particleOpacity = 0.5;
    brush.particleRadiusDeviation = 6;
    canvas.freeDrawingBrush = brush;
  }, [
    fabricCanvasRef,
    visitorRef,
    cursorRef,
    visitor.id,
    updatePaint,
    setLastPainted,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Don't fill up the paint while actively painting
      const canvas = fabricCanvasRef.current;
      if (canvas.freeDrawingBrush.painting) return;

      const paint = visitorRef.current?.paint;
      if (typeof paint === "undefined") return;
      if (paint === MAX_PAINT) return;

      const lastPainted = visitorRef.current?.lastPainted;
      if (typeof lastPainted === "undefined") return;

      const newPaint = Math.min(
        lastPainted.paint +
          (MAX_PAINT / TOTAL_REFILL_TIME_MS) * (Date.now() - lastPainted.t),
        MAX_PAINT
      );

      updatePaint(newPaint);
    }, REFILL_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [fabricCanvasRef, visitorRef, updatePaint]);

  return (
    <>
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
      <ProgressBar
        className="h-4 my-4"
        progressColor="#11660e"
        progress={(visitor.paint / MAX_PAINT) * 100}
      />
    </>
  );
};

export default GraffitiCanvas;
