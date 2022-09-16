export const randomXY = (pointer, radius, rn1, rn2) => {
  const r = radius * Math.sqrt(rn1);
  const theta = rn2 * 2 * Math.PI;
  return {
    x: pointer.x + r * Math.cos(theta),
    y: pointer.y + r * Math.sin(theta),
  };
};

export const randomRadius = (r, variation, rn) => {
  return r + variation * rn;
};
