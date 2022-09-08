import { useEffect } from "react";
import useFabric from "../../hooks/useFabric";

const GraffitiCanvas = () => {
  const { canvasElRef, fabricCanvasRef } = useFabric();

  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    canvas.on("mouse:over", () => {
      console.log("MOUSEOVER");
    });
  }, [fabricCanvasRef]);

  return (
    <div>
      <canvas ref={canvasElRef} width={500} height={500} />
    </div>
  );
};

export default GraffitiCanvas;
