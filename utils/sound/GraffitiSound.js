import { el } from "@elemaudio/core";
import WebRenderer from "@elemaudio/web-renderer";
import { Samples, fetchFiles } from "./utils";
import { hexToNormalizedHSL } from "../color";
import { Interval, Note } from "tonal";
import { elShiftSample, elStereoPan } from "./el";

export class GraffitiSound {
  constructor() {
    this.groups = {};
    this.bpm = 244;
    // 16th note pulses at bpm in milliseconds
    // this.metro = el.metro({ interval: 60_000 / this.bpm / 4 });
    this.metro = el.metro({ interval: 60_000 / this.bpm });
  }

  updateGroups(eventType, target, allGroups) {
    // Update the current map of seed to group/node
    if (eventType === "added") {
      this.groups[target.seed] = {
        group: target,
        nodes: this.nodesForGroup(target),
      };
    } else if (eventType === "removed") {
      delete this.groups[target.seed];
    }
    if (Samples.loaded) this.render();
  }

  nodesForGroup(group) {
    // When loading the page, the canvas loads before all samples
    if (!Samples.loaded) return;

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
      Interval.distance(Samples.STAB2.note.name, pitch)
    );

    // Create pitched samples
    let [left, right] = [0, 1].map((channel) =>
      elShiftSample(
        {
          path: Samples.STAB2.chan(channel),
          duration: Samples.STAB2.duration,
          shift: shift,
          mode: "trigger",
        },
        this.metro
      )
    );

    // Lightness to volume
    [left, right] = [el.mul(l, left), el.mul(l, right)];

    // Position to pan
    const normalizedLRPosition = (group.left + group.width / 2) / 500;
    const pan = Math.max(Math.min(normalizedLRPosition * 2 - 1, 1), -1);
    [left, right] = elStereoPan({ pan: pan }, left, right);

    return { l: left, r: right };
  }

  async render() {
    const groups = Object.values(this.groups);
    if (groups.length > 0) {
      let l = groups.map((g) => g.nodes.l);
      l = el.div(el.add(...l), l.length);
      let r = groups.map((g) => g.nodes.r);
      r = el.div(el.add(...r), r.length);
      console.log(await this.core.render(l, r));
    } else {
      console.log(await this.core.render(0));
    }
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
    // Define the nodes for all groups provided before samples were loaded
    for (let group of Object.values(this.groups)) {
      if (!group.nodes) {
        group.nodes = this.nodesForGroup(group.group);
      }
    }
    this.render();
  }
}
