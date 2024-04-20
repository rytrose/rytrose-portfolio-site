import { el } from "@elemaudio/core";
import WebRenderer from "@elemaudio/web-renderer";
import { SAMPLES, fetchFiles } from "./utils";
import { hexToNormalizedHSL } from "../color";
import { Interval, Note } from "tonal";

export class GraffitiSound {
  constructor() {
    this.groups = {};
  }

  updateGroups(eventType, target, allGroups) {
    // Update the current map of seed to group/node
    if (eventType === "added") {
      this.groups[target.seed] = {
        group: target,
        node: this.nodeForGroup(target),
      };
    } else if (eventType === "removed") {
      delete this.groups[target.seed];
    }
  }

  nodeForGroup(group) {
    const [h, s, l] = hexToNormalizedHSL(group.color);

    // Hue to pitch class
    const pitchClasses = Note.names();
    const pitchClassIndex = Math.floor(h * pitchClasses.length);
    const pitchClass = pitchClasses[pitchClassIndex];

    // Saturation to octave
    const octaves = Array.from({ length: 4 }, (_, i) => {
      return (
        // Lowest octave is 2
        2 + i
      );
    });
    const octaveIndex = Math.floor(s * octaves.length);
    const octave = octaves[octaveIndex];
    const pitch = `${pitchClass}${octave}`;
    const shift = Interval.semitones(
      Interval.distance(SAMPLES.STAB2.note.name, pitch)
    );

    // Lightness to volume
    const vol = l;

    // Position to pan
    // TODO

    console.log(group.seed, h, s, l, pitch, shift);
  }

  async start() {
    this.ctx = new AudioContext();
    this.core = new WebRenderer();
    const node = await this.core.initialize(this.ctx, {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [2],
      processorOptions: {
        virtualFileSystem: await fetchFiles(this.ctx),
      },
    });
    node.connect(this.ctx.destination);
  }
}
