import { fabric } from "fabric";
import { useRef, useCallback } from "react";

const useFabric = () => {
  const canvasRef = useRef();
  const disposeRef = useRef();
  return {
    canvasElRef: useCallback((node) => {
      if (node) {
        canvasRef.current = new fabric.Canvas(node);
      } else if (canvasRef.current) {
        canvasRef.current.dispose();
        if (disposeRef.current) {
          disposeRef.current();
          disposeRef.current = undefined;
        }
      }
    }, []),
    fabricCanvasRef: canvasRef,
  };
};

export default useFabric;
