import store from "store";
import createNotification, { dismissNotification } from "engine/createNotification";
import { randomStrokeSpeed, setStrokeSpeed } from "game/utils/strokeSpeed";
import delay from "utils/delay";
import play from "engine/audio";
import { getRandomAudioVariation } from "audio";
import { getRandomInclusiveInteger } from "utils/math";
import { doOrgasm, end, postOrgasmTorture, skip } from "game/actions/orgasm/orgasm";
import punishment from "game/actions/punishment";
import {
  getRandom_hurryUp_message,
  getRandom_orgasm_message,
  getRandom_orgasmAdvanced_message,
  getRandom_orgasmInTime_message
} from "game/texts/messages";
import { setDefaultGrip } from "game/actions/grip";
import { setDefaultStrokeStyle } from "game/enums/StrokeStyle";
import executeAction from "engine/executeAction";
import { applyProbability } from "game/actions/generateAction";
import createProbability from "game/utils/createProbability";


/**
 * Plays a orgasm sound and creates a random orgasm notification.
 * Also sets stroke style, grip and speed.
 *
 * @param {string} message
 *   the message to be displayed
 * @returns {Promise<*>}
 *   notificationId - the id of the message to be dismissed in the next step.
 */
export const getToTheOrgasm = (message = getRandom_orgasm_message()) => {
  const { config: { fastestStrokeSpeed } } = store;

  if (store.config.enableVoice) {
    play(getRandomAudioVariation("Orgasm"));
  }

  setStrokeSpeed(fastestStrokeSpeed);
  setDefaultGrip();
  setDefaultStrokeStyle();

  return createNotification(message, { autoDismiss: false });
};

/**
 * Plays a orgasm sound and creates a random orgasmAdvanced notification.
 *
 * @param {string} message
 *   the message to be displayed
 * @returns {*}
 */
export const getToTheOrgasmAdvanced = (message = getRandom_orgasmAdvanced_message()) => {

  if (store.config.enableVoice) {
    play(getRandomAudioVariation("Orgasm"));
  }
  return createNotification(message, { autoDismiss: false });
};

/**
 * Allow the user to cum. But only if he can do it in time.
 *
 * Recommendation: An edge before this action would make sense.
 *
 * @returns {Promise<*[]>}
 *   the trigger to display
 */
export const doOrgasmInTime = async (timer = getRandomInclusiveInteger(5, 60), orgasmFunc = getToTheOrgasm) => {

  let orgasmed = false;

  const notificationId = await orgasmFunc(getRandom_orgasmInTime_message());

  const trigger_done = async () => {
    orgasmed = true;
    dismissNotification(notificationId);
    dismissNotification(timerId);

    await postOrgasmTorture();
    await end();
  };
  trigger_done.label = "Orgasmed";

  const countdown = async () => {
    await delay((timer + 1) * 1000);  // Wait till the timer runs up
    // now check whether user did reach the orgasm in time
    if (!orgasmed) {
      //store.engine.actionTriggers = null;
      dismissNotification(notificationId);
      dismissNotification(timerId);
      await executeAction(punishment, true);  // Interrupt other action (trigger_done)
    }

  };

  const timerId = createNotification(getRandom_hurryUp_message(), {
    time: timer * 1000
  });

  countdown();  // don't wait for the promise just start the thread.

  return [trigger_done];
};

/**
 * Allow the user to cum. He make take infinite time, but he mustn't
 * change the speed or grip or style of stroking to do so.
 *
 * Recommendation: The user should be at the brink of orgasm before calling this method.
 *
 * @returns {Promise<*[]>}
 *   the triggers to be displayed
 */
export const doOrgasmAdvanced = async () => {

  const notificationId = await getToTheOrgasmAdvanced(getRandom_orgasmAdvanced_message());

  const trigger_done = async () => {
    dismissNotification(notificationId);

    await postOrgasmTorture();
    await end();
  };
  trigger_done.label = "Orgasmed";

  const trigger_fail = async () => {  // Increase game time on fail.
    dismissNotification(notificationId);
    await punishment();
    await skip();
  };
  trigger_fail.label = "I can't";

  return [trigger_done, trigger_fail];
};

/**
 * Hardest task. User has to cum without changing style, pace or grip and has a time limit.
 *
 * @returns {Promise<void>}
 */
export const doOrgasmAdvancedInTime = async () => {
  await doOrgasmInTime(getRandomInclusiveInteger(30, 90), getToTheOrgasmAdvanced);
};

/**
 * Harder version of doOrgasmInTime: Instead of displaying a continuously
 * running progress bar only a countdown with random counting intervals is displayed.
 *
 * I am thinking of big white letters in the middle of the screen over the videos/gifs/picture.
 * maybe transparency 50% and fading out after 1-2 seconds of display
 *
 * When reaching Zero the user gets a very short amount of time to orgasm.
 *
 * @returns {Promise<void>}
 */
export const doOrgasmCountdown = async () => {
  //TODO: Implement // I Need help @thefapinstructor I intend a implementation like:
  // for (let i = 10; i >= 0; i--) {
  //   displayNumber(i);
  //   const time = getRandomInclusiveInteger(1, 5);
  //   await delay(time * 1000);
  // }
};
/**
 * TODO: Implement further advanced version.
 * @returns {Promise<void>}
 */
export const doOrgasmAdvancedCountdown = async () => {

};

/**
 * The user is __not__ allowed to cum and has to end the session.
 *
 * @returns {Promise<done>}
 */
export const doDenied = async () => {
  const { config: { fastestStrokeSpeed } } = store;

  setStrokeSpeed(fastestStrokeSpeed);

  if (store.config.enableVoice) {
    play(getRandomAudioVariation("Denied"));
  }

  const nid = createNotification("Denied an orgasm");

  const done = async () => {
    dismissNotification(nid);
    await end();
  };
  done.label = "Denied";

  return done;
};


/**
 * Let the game go on by increasing the maximum game time by 20%.
 *
 * @returns {Promise<void>}
 */
export const skipAdvanced = async () => {
  // extend the game by 20%
  store.config.maximumGameTime *= 1.2;

  setStrokeSpeed(randomStrokeSpeed());
};
skipAdvanced.label = "Skip & Add Time";


/**
 * Fetches one of all orgasms.
 * Difficulty: mostly advanced
 * @returns {action}
 *   A random action
 */
export const getRandomOrgasm = () => {
  const chosenActions = initializeOrgasms();
  return applyProbability(chosenActions, 1)[0];
};

/**
 * Manually created list of all orgasms with probabilities required in final orgasm phase:
 * createProbability takes your action and the probability percentage the action will be invoked
 * as an orgasm in the end of the game
 *
 * @returns {*[]}
 *   an array with all the function-probability pairs: {func, probability}
 */
export const initializeOrgasms = () =>
  [
    // list of all available orgasms
    createProbability(doOrgasmAdvancedInTime, 10),
    createProbability(doOrgasmInTime, 10),
    createProbability(doOrgasmAdvanced, 10),
    createProbability(doOrgasmInTime, 10),
    createProbability(doOrgasm, 1),
  ].filter(action => !!action);
