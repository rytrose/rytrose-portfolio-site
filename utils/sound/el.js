import { el } from "@elemaudio/core";

/**
 * Applies rudimentary stereo panning to the two input signals.
 * Pan must be a valus [-1.0, 1.0] where negative favors the first
 * channel and positive favors the second channel. Defaults to 0.0,
 * or centered.
 */
export const elStereoPan = ({ pan = 0.0, key = "pan" }, l, r) => {
  const panMapped = el.mul(
    el.div(el.add(el.const({ key: key, value: pan }), 1), 2),
    el.div(Math.PI, 2)
  );
  return [el.mul(l, el.cos(panMapped)), el.mul(r, el.sin(panMapped))];
};
