import { useRef, useCallback } from "react";
import { GraffitiSound } from "../utils/sound/GraffitiSound";

const useGraffitiSound = () => {
  const sound = new GraffitiSound();
  const soundRef = useRef(sound);
  const startSound = useCallback(async () => {
    await soundRef.current.start();
  }, [soundRef]);
  return [soundRef, startSound];
};

export default useGraffitiSound;
