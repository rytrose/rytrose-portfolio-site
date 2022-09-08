import { fabric } from "fabric";
import { useRef, useCallback } from "react";

const useFabric = (options) => {
  console.log("use fabric");
  const canvasRef = useRef();
  const disposeRef = useRef();
  return {
    canvasElRef: useCallback(
      (node) => {
        if (node) {
          canvasRef.current = new fabric.Canvas(node, options);
        } else if (canvasRef.current) {
          canvasRef.current.dispose();
          if (disposeRef.current) {
            disposeRef.current();
            disposeRef.current = undefined;
          }
        }
      },
      [options]
    ),
    fabricCanvasRef: canvasRef,
  };
};

export default useFabric;
