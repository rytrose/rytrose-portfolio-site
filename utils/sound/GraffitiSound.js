import { el } from "@elemaudio/core";
import WebRenderer from "@elemaudio/web-renderer";
import { Samples, fetchFiles, hash } from "./utils";
import { hexToNormalizedHSL } from "../color";
import { Interval, Note } from "tonal";
import { elShiftSample, elStereoPan } from "./el";

export class GraffitiSound {
  constructor() {
    this.groups = {};
    this.bpm = 144;
    // 16th note pulses at bpm in milliseconds
    this.metro = el.metro({ interval: 60_000 / this.bpm / 4 });
    // this.metro = el.metro({ interval: 60_000 / this.bpm });
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

    // Hue and saturation to pitch class
    const pitchClasses = Note.names();
    const pitchClassIndex = Math.floor(((s + l) / 2) * pitchClasses.length);
    const pitchClass = pitchClasses[pitchClassIndex];

    // Saturation and lightness to octave
    const minOctave = 2;
    const numOctaves = 4;
    const octaves = Array.from({ length: numOctaves }, (_, i) => {
      return (
        // Lowest octave is 2
        minOctave + i
      );
    });
    // More lightness and less saturated is higher
    const octaveIndex = Math.floor(((1 - s + l) / 2) * octaves.length);
    const octave = octaves[octaveIndex];
    const pitch = `${pitchClass}${octave}`;
    const shift = Interval.semitones(
      Interval.distance(Samples.STAB2.note.name, pitch)
    );

    // Spray density to note probablility
    const particleArea =
      group.brushNumParticles * (Math.PI * Math.pow(group.particleRadius, 2));
    const brushArea = Math.PI * Math.pow(group.brushRadius, 2);
    // Range ~0.01 - ~0.59
    const density = particleArea / brushArea;
    const seed = hash(group.seed);
    let play = el.ge(
      1 - density,
      el.latch(this.metro, el.rand({ key: seed.toString() }))
    );
    play = el.snapshot({ name: `${group.seed}:play` }, play, play);

    // Create pitched samples
    const attenuated = 1 - 0.3 * (octave - minOctave - 1);
    let [left, right] = [0, 1].map((channel) =>
      el.mul(
        // Shifting up makes the sample louder, and shifting down softer, so adjust a bit
        attenuated,
        elShiftSample(
          {
            path: Samples.STAB2.chan(channel),
            duration: Samples.STAB2.duration,
            shift: shift,
            mode: "trigger",
          },
          play
        )
      )
    );

    // Position to pan
    const panLFO = el.triangle(1 / 4);
    const normalizedLeft = Math.max(group.left / 500, 0);
    const normalizedRight = Math.min((group.left + group.width) / 500, 1);
    const panAmp = (normalizedRight - normalizedLeft) * 2;
    const shiftedLeft = normalizedLeft * 2 - 1;
    const pan = el.add(shiftedLeft, el.mul(panLFO, panAmp));
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
      console.debug(await this.core.render(l, r));
    } else {
      console.debug(await this.core.render(0));
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

    // Setup play animation handler
    this.core.on("snapshot", (e) => {
      const [seed, event] = e.source.split(":");
      if (event === "play") {
        const group = this.groups[seed]?.group;
        if (!group) return;
        group.animate("opacity", "-=0.2", {
          duration: 50,
          onChange: group.canvas.renderAll.bind(group.canvas),
          onComplete: () => {
            group.animate("opacity", "+=0.2", {
              duration: 50,
              onChange: group.canvas?.renderAll.bind(group.canvas),
            });
          },
        });
      }
    });
  }
}
