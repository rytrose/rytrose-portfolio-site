import { el } from "@elemaudio/core";

/**
 * Applies rudimentary stereo panning to the two input signals.
 * Pan must be a valus [-1.0, 1.0] where negative favors the first
 * channel and positive favors the second channel. Defaults to 0.0,
 * or centered.
 */
export const elStereoPan = ({ pan = 0.0, key = "pan" }, l, r) => {
  const panMapped = el.mul(el.div(el.add(pan, 1), 2), el.div(Math.PI, 2));
  return [el.mul(l, el.cos(panMapped)), el.mul(r, el.sin(panMapped))];
};

export const elShiftSample = (
  { path, duration, shift = 0, mode = "loop" },
  reset
) => {
  let play;
  if (mode === "trigger") {
    play = el.add(
      el.div(el.counter(reset), el.sr()), // Counts in seconds
      // When greater than duration, sample is muted
      el.mul(
        // 0 when reset is low, -1 when reset is high to
        // account for el.counter outputting 0 when reset
        -1,
        el.eq(0, reset) // !reset
      )
    );
  } else {
    play = el.mul(
      el.syncphasor(1 / duration, reset), // Phasor with period sample duration
      duration, // Multipled by duration to get playhead in seconds
      el.sub(el.mul(reset, 2), 1) // Gated by reset pulse train, which outputs -1 when
      // pulse train is low to get sampleseq2 to mute the sample instead of playing the
      // first frame at the sample when at 0
    );
  }
  return el.sampleseq2(
    {
      path: path,
      duration: duration,
      shift: shift,
      seq: [{ time: 0, value: 1 }],
    },
    play
  );
};
