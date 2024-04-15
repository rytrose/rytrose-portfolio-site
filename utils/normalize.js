export const denormalizeToRange = (value, min, max) => {
  return value * (max - min) + min;
};

export const normalize = (value, min, max) => {
  return (value - min) / (max - min);
};

export const quantize = (value, quantizedValues) => {
  return quantizedValues[bisectLeft(quantizedValues, value)];
};

// https://stackoverflow.com/a/73179119/3434708
const bisectLeft = (arr, value, lo = 0, hi = arr.length - 1) => {
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] < value) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
};
