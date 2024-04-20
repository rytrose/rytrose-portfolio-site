import Prando from "prando";
import * as Tone from "tone";
import { hexToNormalizedHue } from "../color";
import { denormalizeToRange } from "../normalize";

export class GraffitiSound {
  BPM = 120;
  // 4/4
  TIME_SIGNATURE = 4;
  // While it probably doesn't make any meaningful difference, skip ahead in the RNG sequence
  // a bit to not use the exact RNG values that the brush does
  // (which uses the same seed but doesn't skip at all)
  RNG_SKIP = 1000;

  constructor() {
    this.groups = {};
    this.initializers = [];
  }

  updateGroups(eventType, target, allGroups) {
    // Update the current map of seed to group/loops
    if (eventType === "added") {
      this.groups[target.seed] = {
        group: target,
        loops: this.generateLoopsForGroup(target),
      };
    } else if (eventType === "removed") {
      const groupEntry = this.groups[target.seed];
      if (groupEntry) {
        groupEntry.loops.forEach((loop) => {
          loop.dispose();
        });
      }
      delete this.groups[target.seed];
    }
  }

  generateLoopsForGroup(group) {
    const rng = new Prando(group.seed);
    rng.skip(this.RNG_SKIP);

    const synth = new Tone.Synth({
      volume: 0,
      detune: 0,
      portamento: 0,
      envelope: {
        attack: 0.02,
        attackCurve: "exponential",
        decay: 0.02,
        decayCurve: "linear",
        release: 0.5,
        releaseCurve: "exponential",
        sustain: 0.1,
      },
      oscillator: {
        partialCount: 0,
        partials: [],
        phase: 0,
        type: "amtriangle",
        harmonicity: 0,
        modulationType: "sine",
      },
    });
    const panner = new Tone.Panner();
    panner.set({ pan: -1 });
    panner.toDestination();
    const initializer = () => {
      const compressor = new Tone.Compressor(-30, 3);
      const reverb = new Tone.Reverb(4);
      reverb.wet.value = 0.2;
      synth.chain(reverb, compressor, panner);
    };
    if (this.compressor) {
      initializer();
    } else {
      this.initializers.push(initializer);
    }

    const loop = new Tone.Loop((time) => {
      const particleArea =
        group.brushNumParticles * (Math.PI * Math.pow(group.particleRadius, 2));
      const brushArea = Math.PI * Math.pow(group.brushRadius, 2);
      // Range ~0.01 - ~0.59
      const density = particleArea / brushArea;
      const normalizedHue = hexToNormalizedHue(group.color);
      const octave = Math.floor(denormalizeToRange(normalizedHue * 2, 2, 6));

      // Consider an attack every 16th note
      for (const i = 0; i < 16; i++) {
        // Probablility of a note is determined by spray density
        const shouldPlay = rng.next() > 1 - density;
        if (!shouldPlay) {
          continue;
        }

        // Always schedule a measure ahead for performance reasons
        const scheduleTime =
          "+1:" +
          // Current quarter note
          Math.floor(i / 4).toString() +
          ":" +
          // Current sixteenth note
          (i % 4).toString();
        synth.triggerAttackRelease(`C${octave}`, "16n", scheduleTime);
      }
    }, "1m").start("@8n");
    return [loop];
  }

  async start() {
    await Tone.start();
    this.compressor = new Tone.Compressor(-30, 3);
    this.reverb = new Tone.Reverb(4);
    this.reverb.wet.value = 0.2;
    this.initializers.forEach((init) => init());
    this.initializers = [];
    Tone.Transport.bpm.value = this.BPM;
    Tone.Transport.timeSignature = this.TIME_SIGNATURE;
    Tone.Transport.start();
    window.Tone = Tone;
  }
}
