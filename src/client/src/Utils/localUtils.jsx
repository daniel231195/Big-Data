export const assoc = (data, rangeSize) => {
  if (rangeSize > data.length) {
    throw new Error("Range size cannot be larger than the length of the array");
  }

  const startIndex = Math.floor(Math.random() * (data.length - rangeSize + 1));
  const endIndex = startIndex + rangeSize;

  return data.slice(startIndex, endIndex);
};
