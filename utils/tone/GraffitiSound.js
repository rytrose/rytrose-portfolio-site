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

  padLoop() {
    return (
      new Tone.Loop((time) => {
        const pitches = ["B3", "C4", "E4", "G4"];
        this.samplers.pad.triggerAttack(
          pitches[Math.floor(4 * Math.random())],
          `+${Math.floor(4 * Math.random())}:1`
        );
      }, "4m")
        // Start on the next quantized measure
        .start("@1m")
    );
  }

  subLoop() {
    return (
      new Tone.Loop((time) => {
        this.samplers.sub.triggerAttack("C2", "+0:1");
        // TODO
      }, "1m")
        // Start on the next quantized measure
        .start("@1m")
    );
  }

  stab1Loop() {
    return (
      new Tone.Loop((time) => {
        this.samplers.stab1.triggerAttack("E5", "+0:1");
        // TODO
      }, "4n")
        // Start on the next quantized measure
        .start("@1m")
    );
  }

  stab2Loop() {
    return (
      new Tone.Loop((time) => {
        this.samplers.stab2.triggerAttack("B4", "+0:1");
        // TODO
      }, "4n")
        // Start on the next quantized measure
        .start("@1:0:2")
    );
  }

  async loadSamplers() {
    window.compressor = new Tone.Compressor(-30, 3).toDestination();
    window.reverb = new Tone.Reverb(4).connect(window.compressor);
    reverb.wet.value = 0.2;
    await new Promise((resolve) => {
      this.samplers.pad = new Tone.Sampler({
        urls: {
          G4: "pad-chord.wav",
        },
        baseUrl:
          "https://rytrose-personal-website.s3.amazonaws.com/portfolio-site/graffiti-sound/",
        onload: resolve,
      }).connect(window.compressor);
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
      }).connect(window.compressor);
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
    this.subLoop();
    this.stab1Loop();
    this.stab2Loop();
  }
}
