import { fabric } from "fabric";
import { useRef, useCallback } from "react";

// N.B. `options` must be memoized, otherwise the callback
// ref will change on every render and the canvas will be
// continuously disposed and recreated.
const useFabric = (options) => {
  const canvasRef = useRef();
  const callbackRef = useCallback(
    (node) => {
      if (node) {
        canvasRef.current = new fabric.Canvas(node, options);
      } else if (canvasRef.current) {
        canvasRef.current.dispose();
      }
    },
    [options]
  );
  return [callbackRef, canvasRef];
};

export default useFabric;
