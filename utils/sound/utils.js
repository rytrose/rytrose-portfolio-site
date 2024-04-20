import { Note } from "tonal";

export class Sample {
  constructor(filename, note = undefined) {
    this.filename = filename;
    this.note = note;
  }

  chan(channel) {
    return `${this.filename}:${channel}`;
  }
}

export const SAMPLES = {
  STAB2: new Sample("stab2.wav", Note.get("B2")),
};

export const BASE_URL =
  "https://rytrose-personal-website.s3.amazonaws.com/portfolio-site/graffiti-sound/";

export const fetchFiles = async (ctx) => {
  let fs = {};
  for (let sample of Object.values(SAMPLES)) {
    let res = await fetch(BASE_URL + sample.filename);
    let buf = await ctx.decodeAudioData(await res.arrayBuffer());
    for (let channel = 0; channel < buf.numberOfChannels; channel++) {
      fs[sample.chan(channel)] = buf.getChannelData(channel);
    }
  }
  console.log("Loaded filesystem", Object.keys(fs));
  return fs;
};
