import { getRandomInclusiveInteger } from "../../utils/math";

export const getRandomMessage = (messageArray) => {
  return messageArray[getRandomInclusiveInteger(0, messageArray.length - 1)];
};

export const getRandom_punishment_message = () => {
  return getRandomMessage(punishment_messages);
};

const punishment_messages = [
  "You Looser!",
  "You are disgusting",
  "You are not worth it anyway",
  "Ha Ha Ha! You are not even up for the simple tasks",
  "Then you shall be punished",
  "Then you shall receive nothing, but punishment!"
];

export const getRandom_edge_message = () => {
  return getRandomMessage(edge_messages);
};

const edge_messages = [
  "Edge! I know you can do it.",
];

export const getRandom_edgeAdvanced_message = () => {
  return getRandomMessage(edgeAdvanced_messages);
};

const edgeAdvanced_messages = [
  "Edge just like this. Keep it steady.",
  "Not faster, nor slower. If you don't want to receive punishment, then you better edge exactly this way.",
  "Keep that pace, keep that grip, and don't change the style ... now ... get to the edge ... if you can 3:D",
  "Keep it steady, I want you just right before cumming"
];

export const getRandom_edgeInTime_message = () => {
  return getRandomMessage(edgeInTime_messages);
};

const edgeInTime_messages = [
  "Get to the edge now!",
  "I don't have much time for your dick today. Edge. Now!",
  "You want to get punished for not reaching the edge in time, don't you?"
];

export const getRandom_handsOff_message = () => {
  return getRandomMessage(handsOff_messages);
};

const handsOff_messages = [
  "Let go of your cock",
  "Hands off",
  "Hands off your cock",
  "Take your hands away of your cock!",
  "Don't you dare touching your cock!"
];

