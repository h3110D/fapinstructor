import store from "store";
import play from "engine/audio";
import audioLibrary from "audio";
import elapsedGameTime from "game/utils/elapsedGameTime";
import { randomStrokeSpeed, setStrokeSpeed } from "game/utils/strokeSpeed";
import { setDefaultGrip } from "game/actions/grip";
import { setStrokeStyleDominant } from "game/enums/StrokeStyle";
import createNotification, { dismissNotification } from "engine/createNotification";
import { getRandomBoolean, getRandomInclusiveInteger } from "utils/math";
import delay from "utils/delay";
import { strokerRemoteControl } from "game/loops/strokerLoop";

/**
 * Determines if the user should edge.
 *
 * @returns {boolean}
 *   true when the user should edge now
 */
export const shouldEdge = () => {
  const {
    config: { minimumGameTime, maximumGameTime, actionFrequency, edgeFrequency }
  } = store;

  let result = false;
  const isAllowedChance = elapsedGameTime("minutes") >= minimumGameTime * 1.2;

  if (isAllowedChance) {
    const rand = Math.random();
    const gameCompletionPercent =
      elapsedGameTime("seconds") / (maximumGameTime * 60);

    // Probability Graph: https://www.desmos.com/calculator/atc32p8kof
    result =
      gameCompletionPercent / actionFrequency * (1 + edgeFrequency / 100) >
      rand;
  }

  return result;
};

/**
 * lets you ride the edge for time seconds.
 *
 * @param time
 *   How long to ride the edge
 */
export const rideTheEdge = async (time = getRandomInclusiveInteger(5, 30)) => {
  setStrokeSpeed(0);
  const notificationId = createNotification("Ride the edge", {
    autoDismiss: false
  });

  if (store.config.enableVoice) {
    play(audioLibrary.KeepStroking);
  }

  await delay(time * 1000);
  dismissNotification(notificationId);
};

/**
 * Decides whether to ride the edge or not and increases edge counter.
 *
 * @param time
 *   How long to ride the edge
 */
export const edging = async time => {
  store.game.edges++;

  const holdIt = getRandomBoolean();

  if (holdIt || time) {
    await rideTheEdge(time);
  }
};

/**
 * The whole cooldown stuff after edging and setting up the stroking task again.
 */
export const stopEdging = async () => {
  const { config: { edgeCooldown } } = store;

  createNotification("Let go of your cock");
  strokerRemoteControl.pause();

  await delay(edgeCooldown * 1000);

  strokerRemoteControl.play();

  setStrokeSpeed(randomStrokeSpeed());
  createNotification("Start stroking again");

  if (store.config.enableVoice) {
    play(audioLibrary.StartStrokingAgain);
  }

  await delay(3000);
};

/**
 * Sets the Speed to Maximum, the Grip to default and the StrokeStyle to Dominant. Displays message.
 *
 * @param message
 *   the message that is displayed.
 * @returns {Promise<*>}
 *   the notificationId
 */
export const getToTheEdge = async (message = "Get to the edge for me") => {
  const { config: { fastestStrokeSpeed } } = store;

  if (store.config.enableVoice) {
    play(audioLibrary.Edge);
  }

  setStrokeSpeed(fastestStrokeSpeed);

  setDefaultGrip();
  setStrokeStyleDominant();

  return createNotification(message, {
    autoDismiss: false
  });
};

/**
 * Calls getToTheEdge() and displays an "Edging" button.
 *
 * @returns {Promise<*[]>}
 */
const edge = async () => {
  const notificationId = await getToTheEdge();

  const trigger = async () => {
    dismissNotification(notificationId);
    await edging();
    await stopEdging();
  };
  trigger.label = "Edging";

  return [trigger];
};

export default edge;
