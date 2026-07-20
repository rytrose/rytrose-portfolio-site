export const randomXY = (pointer, radius, rn1, rn2) => {
  const r = radius * Math.sqrt(rn1);
  const theta = rn2 * 2 * Math.PI;
  return {
    x: pointer.x + r * Math.cos(theta),
    y: pointer.y + r * Math.sin(theta),
  };
};

// Box-Muller 2D Gaussian — denser at center, sparse at edges like real aerosol spray.
// Consumes the same 2 RNG values as randomXY so the per-particle RNG sequence (3 calls total)
// is preserved.
export const randomXYGaussian = (pointer, radius, rn1, rn2) => {
  const u1 = Math.max(Number.EPSILON, rn1);
  const mag = Math.sqrt(-2.0 * Math.log(u1));
  const sigma = radius / 3.0; // ~99.7% of particles land within the brush radius
  return {
    x: pointer.x + mag * Math.cos(2 * Math.PI * rn2) * sigma,
    y: pointer.y + mag * Math.sin(2 * Math.PI * rn2) * sigma,
  };
};

export const randomRadius = (r, variation, rn) => {
  return r + variation * rn;
};

// Resolves any CSS color string to [r, g, b] by rendering a single pixel.
// Browser-only. Call once per color value and cache the result.
export const parseCSSColorToRGB = (cssColor) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = cssColor;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
};
