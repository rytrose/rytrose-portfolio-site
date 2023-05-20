import { useEffect, useState } from "react";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../tailwind.config";

const resolvedTailwindConfig = resolveConfig(tailwindConfig);

const useTailwindBreakpoint = (breakpoint) => {
  const [innerWidth, setInnerWidth] = useState(0);
  const [isPastBreakpoint, setIsPastBreakpoint] = useState(false);

  useEffect(() => {
    const onResize = () => setInnerWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    // Call explicitly for page load
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const value = resolvedTailwindConfig.theme.screens[breakpoint];
    if (!value) return;
    const px = +value.slice(0, value.indexOf("px"));
    setIsPastBreakpoint(innerWidth >= px);
  }, [breakpoint, innerWidth]);

  return isPastBreakpoint;
};

export default useTailwindBreakpoint;
