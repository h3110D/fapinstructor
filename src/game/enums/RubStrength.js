/**
 * {{0: barely, 1: slightly, 2: " ", 3: gentle, 4: intensively}}
 */
const RubStrengthString = {
  0: "barely ",
  1: "slightly ",
  2: " ",
  3: "gentle ",
  4: "intensively ",
};
/**
 * {{Barely: 0, Slightly: 1, Normally: 2, Gentle: 3, Intensively: 4}}
 */
const RubStrengthEnum = {
  Barely: 0,
  Slightly: 1,
  Normally: 2,
  Gentle: 3,
  Intensively: 4,
};

const RubStrengthStringArray = Object.entries(RubStrengthString);

const RubStrengthArray = Object.entries(RubStrengthEnum);

/**
 * Chooses a random Strength from all available
 * @returns {string}
 */
const getRandomRubStrength = () => {
  return RubStrengthStringArray[Math.floor(Math.random()*RubStrengthStringArray.length)][1];
};

export {RubStrengthEnum, RubStrengthString, RubStrengthStringArray, RubStrengthArray, getRandomRubStrength}
