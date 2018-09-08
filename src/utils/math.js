/**
 * Rounds a number to the provided number of decimal places.
 */
export const round = (value, decimals) => {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
};

/**
 * Returns a random integer between and including the specified min, max.
 */
export const getRandomInclusiveInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Returns true only at a percent percentage chance.
 *
 * @param percent
 *   the percentage of cases the function will evaluate to true.
 * @returns {boolean}
 *   in percent of all cases the function will return true.
 */
export const chance = (percent) => {
  return getRandomInclusiveInteger(1, 100) < percent;
};

/**
 * Returns a random boolean
 */
export const getRandomBoolean = () => Math.random() >= 0.5;

/**
 * Returns a random number between the specified values.
 * The returned value is no lower than (and may possibly equal) min,
 * and is less than (and not equal) max
 */
export const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};

/**
 * Clamps a number between the specified range.
 * @param {The number the operation takes place on} num
 * @param {The minimum value the result can be} min
 * @param {The maximum value the result can be} max
 */
export const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};
