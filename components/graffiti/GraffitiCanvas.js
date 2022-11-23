import { fabric } from "fabric";
import { useEffect, useRef, useCallback, useMemo, useState } from "react";
import ReactSlider from "react-slider";
import Modal from "../Modal";
import useResizeObserver from "use-resize-observer";
import useFabric from "../../hooks/useFabric";
import useKeyPress from "../../hooks/useKeyPress";
import useVisitor from "../../hooks/useVisitor";
import GraffitiBrush from "../../utils/fabric/models/GraffitiBrush";
import Button from "../Button";
import ProgressBar from "../ProgressBar";
import useGraffitiSound from "../../hooks/useGraffitiSound";
import Loading from "../Loading";
import { colorsForDate } from "../../utils/color";
import GraffittiPalette from "./GraffitiPalette";

const MAX_PAINT = 40000;
// const TOTAL_REFILL_TIME_MS = 24 * 60 * 60 * 1000; // 24 hours
const TOTAL_REFILL_TIME_MS = 30 * 1000; // 10 seconds
const REFILL_INTERVAL_MS = 1000 / 60;

const GraffitiCanvas = () => {
  // Modal state
  const [showModal, setShowModal] = useState(true);
  const [soundLoading, setSoundLoading] = useState(false);

  // Sound reference
  const [soundRef, startSound] = useGraffitiSound();

  // Visitor state
  const [visitor, visitorRef, visitorDispatch] = useVisitor();

  // Graffiti groups added to the canvas that haven't yet been committed
  const stagedGroupsRef = useRef([]);

  // Colors for the day
  const [colorPalette, setColorPalette] = useState([]);

  // Paint bar color
  const [paintColor, setPaintColor] = useState("#000000");

  // Brush size
  const [brushSize, setBrushSize] = useState(0.5);

  // Set the current day's colors on the client
  useEffect(() => {
    setColorPalette(colorsForDate(new Date()));
  }, []);

  // Update visitor paint to max paint if unset
  useEffect(() => {
    let paint = visitor?.paint;
    if (paint === -1) {
      paint = MAX_PAINT;
      visitorDispatch({ type: "setPaint", paint: MAX_PAINT });
    }
  }, [visitor.paint, visitorDispatch]);

  // Ref for the div containing the canvas
  const divRef = useRef();
  // Options for the fabric canvas. Must be memoized otherwise
  // the callback ref will change on every render and the canvas
  // will be continuously disposed and recreated.
  const fabricOptions = useMemo(
    () => ({
      isDrawingMode: true,
      freeDrawingCursor: "none",
    }),
    []
  );
  const [canvasElRef, fabricCanvasRef] = useFabric(fabricOptions);

  // Resizes the canvas responsively
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
      // use the container height instead to prevent scrolling
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

  // Calls the canvas resizing callback whenever the canvas div's size changes
  useResizeObserver({
    ref: divRef,
    onResize: onDivResize,
  });

  // Creates the brush cursor
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
      excludeFromExport: true,
    })
  );

  // Sets up the canvas event handlers
  useEffect(() => {
    // Setup sound
    const sound = soundRef.current;

    // Setup canvas
    const canvas = fabricCanvasRef.current;
    canvas.add(cursorRef.current);

    // Setup fabric event handlers
    canvas.on("mouse:up", (_) => {
      // Serialize canvas
      // const serializedCanvas = JSON.stringify(canvas);
      // setTimeout(() => {
      //   canvas.clear();
      // }, 1000);
      // setTimeout(() => {
      //   canvas.loadFromJSON(serializedCanvas);
      // }, 2000);
    });

    // Updates the brush cursor
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

    // Hides the brush cursor
    canvas.on("mouse:out", (_) => {
      const cursor = cursorRef.current;
      cursor
        .set({
          left: -100,
          top: -100,
        })
        .setCoords();
      canvas.renderAll();
    });

    // When graffiti groups are changed, updates the audio pipeline
    const updateAudioForGroups = (eventType) => {
      return (e) => {
        if (e.target.type === "graffitiGroup") {
          const groups = canvas.getObjects("graffitiGroup");
          // Update the current sound
          sound.updateGroups(eventType, e.target, groups);
        }
      };
    };
    canvas.on("object:added", updateAudioForGroups("added"));
    canvas.on("object:removed", updateAudioForGroups("removed"));

    // Add new group to staged groups
    canvas.on("object:added", (e) => {
      if (e.target.type === "graffitiGroup") {
        stagedGroupsRef.current.push(e.target);
      }
    });

    // Remove group from staged groups
    canvas.on("object:removed", (e) => {
      const stagedGroups = stagedGroupsRef.current;
      if (e.target.type === "graffitiGroup") {
        const i = stagedGroups.indexOf(e.target);
        if (i >= 0) {
          stagedGroups.splice(i, 1);
        }
      }
    });
  }, [
    fabricCanvasRef,
    soundRef,
    cursorRef,
    visitorRef,
    visitorDispatch,
    stagedGroupsRef,
  ]);

  // Dispatches an update to visitor.paint. This callback will be
  // called from the fabric objects.
  const updatePaint = useCallback(
    (paint) => {
      visitorDispatch({ type: "setPaint", paint: paint });
    },
    [visitorDispatch]
  );

  // Stores that last time paint was used to determine the current
  // value for paint after refilling over time
  const setLastPainted = useCallback(() => {
    visitorDispatch({
      type: "setLastPainted",
      lastPainted: {
        t: new Date().getTime(),
        paint: visitorRef.current.paint,
      },
    });
  }, [visitorRef, visitorDispatch]);

  // Sets up the graffiti brush
  useEffect(() => {
    if (typeof visitor.id === "undefined") return;
    const canvas = fabricCanvasRef.current;
    const brush = new GraffitiBrush(canvas, visitorRef, cursorRef, updatePaint);
    const newSize = brush.setBrushSize(0.5);
    cursorRef.current.set({ radius: newSize });
    brush.color = colorPalette[0];
    setPaintColor(colorPalette[0]);
    canvas.freeDrawingBrush = brush;
  }, [
    fabricCanvasRef,
    visitorRef,
    cursorRef,
    visitor.id,
    updatePaint,
    colorPalette,
  ]);

  const onBrushResize = useCallback(
    (value) => {
      setBrushSize(value);
      const canvas = fabricCanvasRef.current;
      const brush = canvas.freeDrawingBrush;
      if (brush.type !== "graffitiBrush") return;
      const newSize = brush.setBrushSize(value);
      cursorRef.current.set({ radius: newSize });
    },
    [fabricCanvasRef, cursorRef]
  );

  const setBrushColor = useCallback(
    (color) => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      const brush = canvas.freeDrawingBrush;
      if (brush.type !== "graffitiBrush") return;
      brush.color = color;
      setPaintColor(color);
    },
    [fabricCanvasRef]
  );

  // Setus up paint refill
  useEffect(() => {
    const interval = setInterval(() => {
      // Don't fill up the paint while actively painting
      const canvas = fabricCanvasRef.current;
      if (canvas.freeDrawingBrush.painting) return;

      // Don't fill up paint if there are staged groups
      const stagedGroups = stagedGroupsRef.current;
      if (stagedGroups.length > 0) return;

      // Ensure visitor state is loaded before trying to fill paint
      const paint = visitorRef.current?.paint;
      if (typeof paint === "undefined") return;

      // Don't fill past max paint
      if (paint === MAX_PAINT) return;

      // If no last painted, there is not any paint to fill
      const lastPainted = visitorRef.current?.lastPainted;
      if (typeof lastPainted === "undefined") return;

      // Compute the new paint value given a rate of fill
      // and the time since we started filling (after the last paint)
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
  }, [fabricCanvasRef, visitorRef, stagedGroupsRef, updatePaint]);

  // Sets up undo/redo
  const stackRef = useRef([]);
  useKeyPress(
    useCallback((e) => {
      return e.code === "KeyZ" && !e.shiftKey && e.metaKey;
    }, []),
    useCallback(() => {
      const canvas = fabricCanvasRef.current;
      const stack = stackRef.current;
      const visitor = visitorRef.current;
      const stagedGroups = stagedGroupsRef.current;
      const groups = canvas.getObjects("graffitiGroup");
      if (groups.length === 0) return;
      const last = groups.pop();
      if (!stagedGroups.includes(last)) {
        // Don't undo unstaged groups
        groups.push(last);
        return;
      }
      stack.push(last);
      canvas.remove(last);
      updatePaint(visitor.paint + last.computePaint());
    }, [fabricCanvasRef, visitorRef, stackRef, stagedGroupsRef, updatePaint])
  );
  useKeyPress(
    useCallback((e) => {
      return e.code === "KeyZ" && e.shiftKey && e.metaKey;
    }, []),
    useCallback(() => {
      const canvas = fabricCanvasRef.current;
      const stack = stackRef.current;
      const visitor = visitorRef.current;
      if (stack.length === 0) return;
      const last = stack.pop();
      if (visitor.paint < last.computePaint()) {
        // Not enough paint to redo
        // TODO: alert user
        stack.push(last);
        return;
      }
      canvas.add(last);
      updatePaint(visitor.paint - last.computePaint());
    }, [fabricCanvasRef, visitorRef, stackRef, updatePaint])
  );

  // TODO: reconsider this -- would need to track the brush size on every
  // particle if it can change mid-group
  // // Sets up brush sizing keys
  // useKeyPress(
  //   "KeyA",
  //   useCallback(() => {
  //     onBrushResize(Math.max(brushSize - 0.05, 0));
  //   }, [brushSize, onBrushResize])
  // );
  // useKeyPress(
  //   "KeyD",
  //   useCallback(() => {
  //     onBrushResize(Math.min(brushSize + 0.05, 1));
  //   }, [brushSize, onBrushResize])
  // );

  const commitChanges = useCallback(() => {
    // Update the timestamp of most recent change
    setLastPainted();

    // Clear the staged groups
    stagedGroupsRef.current = [];

    // Clear the undo/redo stack
    stackRef.current = [];

    // TODO: submit updates to canvas
  }, [stagedGroupsRef, stackRef, setLastPainted]);

  return (
    <div className="flex flex-col sm:h-[100vh] sm:max-h-[calc(100vh-162px-24px-48px)]">
      <div className="flex justify-center">
        <Button border onClick={commitChanges}>
          commit
        </Button>
      </div>
      <div className="flex flex-col mt-8 mb-2 justify-center">
        <GraffittiPalette colors={colorPalette} onClick={setBrushColor} />
      </div>
      <div className="flex mt-4 mb-2 justify-center">
        <ReactSlider
          className="cursor-pointer w-full xl:max-w-[50%] h-[1px] bg-slate-200"
          thumbClassName="cursor-pointer w-4 h-4 bg-white border border-slate-300 rounded-full -bottom-2
          focus-visible:outline-none focus-visible:border-slate-400"
          value={brushSize}
          step={0.01}
          max={1}
          onChange={onBrushResize}
        />
      </div>
      <div className="flex justify-center">
        <ProgressBar
          className="h-4 my-4 xl:max-w-[50%]"
          progressColor={paintColor}
          progress={(visitor.paint / MAX_PAINT) * 100}
        />
      </div>
      <div ref={divRef} className="flex grow justify-center">
        <canvas
          className="border border-slate-200"
          ref={canvasElRef}
          width={500}
          height={500}
        />
      </div>
      {showModal && (
        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          showClose={false}
        >
          <div className="flex flex-col justify-center">
            <p className="text-sm">press begin to make art</p>
            <div className="flex justify-center mt-2">
              {soundLoading ? (
                <Loading className="w-[24px]" fill="#94a3b8" />
              ) : (
                <Button
                  onClick={async () => {
                    setSoundLoading(true);
                    await startSound();
                    setShowModal(false);
                    setSoundLoading(false);
                  }}
                  className="font-serif text-center"
                >
                  begin
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GraffitiCanvas;
