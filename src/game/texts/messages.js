import { getRandomInclusiveInteger } from "../../utils/math";

export const getRandomMessage = (messageArray) => {
  return messageArray[getRandomInclusiveInteger(0, messageArray.length - 1)];
};

// Punishment

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

// Edges

export const getRandom_edge_message = () => {
  return getRandomMessage(edge_messages);
};

const edge_messages = [
  "Edge! I know you can do it.",
  "Get to the edge for me",
  "Edge! Show me how much you love working that cock for me"
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

// Orgasm

export const getRandom_orgasm_message = () => {
  return getRandomMessage(orgasm_messages);
};

const orgasm_messages = [
  "You have permission to have a full orgasm",
];

export const getRandom_orgasmAdvanced_message = () => {
  return getRandomMessage(orgasmAdvanced_messages);
};

const orgasmAdvanced_messages = [
  "You have permission to have a full orgasm. But only if you keep stroking exactly the way you are stroking now!",
  "Take your time and keep on stroking until you cum",
  "You now may cum"
];

export const getRandom_orgasmInTime_message = () => {
  return getRandomMessage(orgasmInTime_messages);
};

const orgasmInTime_messages = [
  "Orgasm now!",
  "I don't have time for your worthless cock. Cum. Now!",
  "You will get punished if you don't cum now!"
];

// Hands Off

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

// Hurry Up

export const getRandom_hurryUp_message = () => {
  return getRandomMessage(hurryUp_messages);
};

const hurryUp_messages = [
  "tick ... tack ... tick ... tack ...",
  "Hurry up, I don't want to wait this time",
  "Hurry up!",
  "Do it fast!",
  "faster!"
];

