export const formatDisplayingETH = (value) => {
  if (isNaN(Number(value))) {
    return 0;
    round;
  }
  return Math.floor(Number(value) * 100) / 100;
};
