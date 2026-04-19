import { useRef, useCallback, useEffect } from "react";
import { GraffitiSound } from "../utils/sound/GraffitiSound";

const useGraffitiSound = () => {
  const soundRef = useRef(new GraffitiSound());
  const startSound = useCallback(async () => {
    await soundRef.current.start();
  }, [soundRef]);
  useEffect(() => {
    return () => soundRef.current.stop();
  }, [soundRef]);
  return [soundRef, startSound];
};

export default useGraffitiSound;
