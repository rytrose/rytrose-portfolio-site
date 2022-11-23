import * as Tone from "tone";

export class GraffitiSound {
  BPM = 120;
  // 4/4
  TIME_SIGNATURE = 4;

  constructor() {
    this.groups = {};
    this.samplers = {};
  }

  updateGroups(eventType, target, groups) {
    // Update the current map of seed to group
    this.groups = groups.reduce(
      (newGroups, group) => ({ ...newGroups, [group.seed]: group }),
      {}
    );
  }

  generateToneLoop(group) {
    const pitches = ["B3", "C4", "E4", "G4"];
    return (
      new Tone.Loop(
        (time) => {
          const numNotes = Math.floor(Math.random() * 4);
          for (let i = 0; i < numNotes; i++) {
            const pitchIndex = Math.floor(Math.random() * pitches.length);
            this.samplers.pad.triggerAttackRelease(
              pitches[pitchIndex],
              "8n",
              `+0:${i + 1}`
            );
          }
        },
        // TODO: generate loop interval
        "1m"
      )
        // Start on the next quantized measure
        .start("@1m")
    );
  }

  padLoop() {
    return (
      new Tone.Loop((time) => {
        const pitches = ["B3", "C4", "E4", "G4"];
        this.samplers.pad.triggerAttack(
          pitches[Math.floor(4 * Math.random())],
          `+${Math.floor(4 * Math.random())}:0`
        );
      }, "4m")
        // Start on the next quantized measure
        .start("@1m")
    );
  }

  subLoop() {
    return (
      new Tone.Loop((time) => {
        const pitches = ["B0", "C1", "E1", "G1"];
        this.samplers.pad.triggerAttack(
          pitches[Math.floor(4 * Math.random())],
          `+${Math.floor(4 * Math.random())}:0`
        );
      }, "4m")
        // Start on the next quantized measure
        .start("@1m")
    );
  }

  async loadSamplers() {
    window.reverb = new Tone.Reverb(4).toDestination();
    reverb.wet.value = 0.2;
    await new Promise((resolve) => {
      this.samplers.pad = new Tone.Sampler({
        urls: {
          G4: "pad-chord.wav",
        },
        baseUrl:
          "https://rytrose-personal-website.s3.amazonaws.com/portfolio-site/graffiti-sound/",
        onload: resolve,
      }).toDestination();
    });

    await new Promise((resolve) => {
      this.samplers.stab1 = new Tone.Sampler({
        urls: {
          B4: "stab1.wav",
        },
        baseUrl:
          "https://rytrose-personal-website.s3.amazonaws.com/portfolio-site/graffiti-sound/",
        onload: resolve,
      }).connect(window.reverb);
    });

    await new Promise((resolve) => {
      this.samplers.stab2 = new Tone.Sampler({
        urls: {
          B3: "stab2.wav",
        },
        baseUrl:
          "https://rytrose-personal-website.s3.amazonaws.com/portfolio-site/graffiti-sound/",
        onload: resolve,
      }).connect(reverb);
    });

    await new Promise((resolve) => {
      this.samplers.sub = new Tone.Sampler({
        urls: {
          E1: "sub.wav",
        },
        baseUrl:
          "https://rytrose-personal-website.s3.amazonaws.com/portfolio-site/graffiti-sound/",
        onload: resolve,
      }).toDestination();
    });
    window.samplers = this.samplers;
  }

  async start() {
    await Tone.start();
    await this.loadSamplers();
    Tone.Transport.bpm.value = this.BPM;
    Tone.Transport.timeSignature = this.TIME_SIGNATURE;
    Tone.Transport.start();
    window.Tone = Tone;
    this.padLoop();
    console.log("audio started");
  }
}
