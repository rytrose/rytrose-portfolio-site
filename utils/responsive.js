import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../tailwind.config.js";

const config = resolveConfig(tailwindConfig);

export const atLeastSm = (window) => {
  return window.matchMedia(`(min-width: ${config.theme.screens.sm})`).matches;
};
