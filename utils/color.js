import chroma from "chroma-js";
import Prando from "prando";

const random = (rng, min, max) => {
  return Math.floor(rng.next() * (max - min + 1)) + min;
};

const coordsToHex = (angle, val1, val2) => {
  return chroma(angle, val1 / 100, val2 / 100, "hsl").hex();
};

// Taken from: https://github.com/meodai/farbvelo/blob/main/main.js
export const colorsForDate = (date) => {
  // create deterministic rng for today
  date.setHours(0, 0, 0, 0);
  const rng = new Prando(date.toUTCString());

  // output array
  let colors = [];

  // create an array of hues to pick from.
  const baseHue = random(rng, 0, 360);
  const hues = new Array(6).fill("").map((_, i) => {
    return (baseHue + i * 60) % 360;
  });

  //  low saturation color
  const baseSaturation = random(rng, 5, 40);
  const baseLightness = random(rng, 0, 20);
  const rangeLightness = 90 - baseLightness;

  colors.push(
    coordsToHex(
      hues[0],
      baseSaturation,
      baseLightness * random(rng, 0.25, 0.75)
    )
  );

  // random shades
  const minSat = random(rng, 50, 70);
  const maxSat = minSat + 30;
  const minLight = random(rng, 35, 70);
  const maxLight = Math.min(minLight + random(rng, 20, 40), 95);

  const remainingHues = [...hues];

  for (let i = 0; i < 2; i++) {
    const hue = remainingHues.splice(
      random(rng, 0, remainingHues.length - 1),
      1
    )[0];
    const saturation = random(rng, minSat, maxSat);
    const light = baseLightness + random(rng, 0, 10) + rangeLightness * i;

    colors.push(coordsToHex(hue, saturation, random(rng, light, maxLight)));
  }

  colors.push(
    coordsToHex(remainingHues[0], baseSaturation, rangeLightness + 10)
  );

  return chroma.scale(colors).padding(0.175).mode("lab").colors(6);
};
