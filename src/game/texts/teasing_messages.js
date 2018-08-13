//TODO: Imports

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
