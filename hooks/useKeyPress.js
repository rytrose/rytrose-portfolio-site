import { useEffect, useState } from "react";

const useKeyPress = (
  targetKey,
  onPressDown = () => {},
  onPressUp = () => {}
) => {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    let checkKey = targetKey;
    if (typeof targetKey !== "function") checkKey = (e) => e.code === targetKey;

    // If pressed key is our target key then set to true
    const downHandler = (e) => {
      if (checkKey(e)) {
        setKeyPressed(true);
        onPressDown();
      }
    };

    // If released key is our target key then set to false
    const upHandler = (e) => {
      if (checkKey(e)) {
        setKeyPressed(false);
        onPressUp();
      }
    };

    // Add event listeners
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [targetKey, onPressDown, onPressUp]);

  return keyPressed;
};

export default useKeyPress;
