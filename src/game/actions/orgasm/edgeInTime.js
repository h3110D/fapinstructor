import store from "store";
import play from "engine/audio";
import audioLibrary from "audio";
import createNotification, { dismissNotification } from "engine/createNotification";
import { getRandomInclusiveInteger } from "utils/math";
import delay from "utils/delay";
import { edging, getToTheEdge, stopEdging } from "game/actions/orgasm/edge";
import punishment from "../punishment";
import { getRandom_edgeAdvanced_message, getRandom_edgeInTime_message } from "game/texts/messages";


/**
 * You have to get to the edge with the current gripStrength, StrokeStyle and StrokeSpeed!
 *
 * @returns {Promise<*>}
 *   the notificationId
 */
export const getToTheEdgeAdvanced = async (message = getRandom_edgeAdvanced_message()) => {

  if (store.config.enableVoice) {
    play(audioLibrary.Edge);
  }
  return createNotification(message, { autoDismiss: false });
};

/**
 * Calls getToTheEdgeAdvanced() then displays an "Edging" button.
 * @returns {Promise<*[]>}
 */
export const edgeAdvanced = async () => {
  const notificationId = await getToTheEdgeAdvanced();

  const trigger_edge = async () => {
    dismissNotification(notificationId);
    await edging();
    await stopEdging();
  };
  trigger_edge.label = "Edging";

  const trigger_fail = async () => {
    dismissNotification(notificationId);
    await punishment();
  };
  trigger_fail.label = "I can't";

  return [trigger_edge, trigger_fail];
};

/**
 * DANGER ZONE - Multithreading
 * Checks whether a user reaches the edge in time.
 *
 * @param timer
 *   the time in seconds in which the user has to reach the edge
 * @param edgeFunc
 *   the edge function
 * @returns {Promise<*[]>}
 */
export const edgeInTime = async (timer = getRandomInclusiveInteger(10, 40), edgeFunc = getToTheEdge) => {
  const m = getRandom_edgeInTime_message();
  const notificationId = await edgeFunc(m);
  let edged = false;
  const trigger = async () => {
    edged = true;
    dismissNotification(notificationId);
    dismissNotification(timerId);
    await edging();
    await stopEdging();
  };
  trigger.label = "Edging";

  const countdown = async () => {
    await delay((timer + 1) * 1000);  // Wait till the timer runs up
    // now check whether user did reach the edge in time
    if (!edged) {
      dismissNotification(notificationId);
      dismissNotification(timerId);
      await punishment();
    }

  };

  const timerId = createNotification(`Hurry up, I don't want to wait this time`, {
    time: timer * 1000
  });

  countdown();  // don't wait for the promise just start the thread.

  return [trigger];
};

export const edgeAdvancedInTime = async (timer = getRandomInclusiveInteger(20, 60)) => {
  return edgeInTime(timer, getToTheEdgeAdvanced)
};

