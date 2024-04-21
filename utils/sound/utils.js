import { Note } from "tonal";

class Sample {
  constructor(filename, note = undefined) {
    this.filename = filename;
    this.note = note;
  }

  updateWithBuffer(buf) {
    this.sampleRate = buf.sampleRate;
    this.length = buf.length;
    this.duration = buf.duration;
  }

  chan(channel) {
    return `${this.filename}:${channel}`;
  }
}

/**
 * Available samples. Note that the AudioBuffer properties for each sample
 * are not populated until the sample has been fetched over the network.
 */
export class Samples {
  static loaded = false;
  static STAB2 = new Sample("stab2.wav", Note.get("B2"));

  static all() {
    return [this.STAB2];
  }
}

export const fetchFiles = async (ctx) => {
  const BASE_URL =
    "https://rytrose-personal-website.s3.amazonaws.com/portfolio-site/graffiti-sound/";
  let fs = {};
  for (let sample of Samples.all()) {
    let res = await fetch(BASE_URL + sample.filename);
    let buf = await ctx.decodeAudioData(await res.arrayBuffer());
    sample.updateWithBuffer(buf);
    for (let channel = 0; channel < buf.numberOfChannels; channel++) {
      fs[sample.chan(channel)] = buf.getChannelData(channel);
    }
  }
  Samples.loaded = true;
  console.log("Loaded filesystem", Object.keys(fs), Samples.all());
  return fs;
};

export const hash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    // Convert the character at the current index to a number.
    var charCode = str.charCodeAt(i);
    // Add the number to the hash code.
    hash = (hash << 5) - hash + charCode;
    // Convert the hash code to a 32-bit integer.
    hash |= 0; // Convert to 32bit integer
  }
  // Return the hash code.
  return hash;
};
