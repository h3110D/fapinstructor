import store from "store";
import createNotification, { dismissNotification } from "engine/createNotification";
import { randomStrokeSpeed, setStrokeSpeed } from "game/utils/strokeSpeed";
import delay from "utils/delay";
import play from "engine/audio";
import audioLibrary, { getRandomAudioVariation } from "audio";
import { strokerRemoteControl } from "game/loops/strokerLoop";
import { edging, getToTheEdge } from "./edge";
import { chance, getRandomInclusiveInteger } from "utils/math";
import { stopGame } from "game";
import { doRuin, postOrgasmTorture, skip } from "./orgasm";
import punishment from "game/actions/punishment";
import {
  getRandom_hurryUp_message,
  getRandom_orgasm_message,
  getRandom_orgasmAdvanced_message
} from "game/texts/messages";
import { setDefaultGrip } from "../grip";
import { setDefaultStrokeStyle, setStrokeStyleDominant } from "game/enums/StrokeStyle";
import { getRandom_orgasmInTime_message } from "../../texts/messages";
import executeAction from "engine/executeAction";


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
  setStrokeStyleDominant();
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
    await endAdvanced();
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
    await endAdvanced();
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
    endAdvanced();
  };
  done.label = "Denied";

  return done;
};

/**
 * Makes the user ruin their orgasm.
 * Duplicate code is necessary due to game end functionality.
 *
 * @returns {Promise<done>}
 */
export const doRuinAdvanced = async () => {
  const { config: { fastestStrokeSpeed } } = store;

  setStrokeSpeed(fastestStrokeSpeed);

  if (store.config.enableVoice) {
    play(audioLibrary.RuinItForMe);
  }

  const nid = createNotification("Ruin it");

  const done = async () => {
    dismissNotification(nid);
    store.game.ruins++;
    endAdvanced();
  };
  done.label = "Ruined";

  return done;
};

/**
 * The game end can be chosen at random by using this function.
 *
 * @returns {Promise<*[]>}
 */
export const determineOrgasm = async () => {
  const {
    config: {
      finalOrgasmAllowed,
      finalOrgasmDenied,
      finalOrgasmRuined,
      finalOrgasmRandom
    }
  } = store;

  let trigger;

  if (finalOrgasmRandom) {
    let options = [];

    if (finalOrgasmAllowed) {
      options.push(doOrgasmAdvanced);
    }
    if (finalOrgasmDenied) {
      options.push(doDenied);
    }
    if (finalOrgasmRuined) {
      options.push(doRuinAdvanced);
    }
    trigger = options[getRandomInclusiveInteger(0, options.length - 1)];
  } else {
    if (finalOrgasmAllowed) {
      trigger = doOrgasmAdvanced;
    } else if (finalOrgasmDenied) {
      trigger = doDenied;
    } else if (finalOrgasmRuined) {
      trigger = doRuin;
    }
  }

  return [await trigger(), skipAdvanced];
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
skip.label = "Skip & Add Time";

/**
 * "Should I stay or should I go now?"
 *
 * Increases number of orgasms.
 * If the maximum number of orgasms is not reached yet, the game will at a chance of 70% go on.
 * Else it will end at this point.
 *
 * @returns {Promise<void>}
 */
export const endAdvanced = async () => {
  const { maximumOrgasms } = store.config;
  strokerRemoteControl.pause();
  store.game.orgasms++;

  // should continue?
  if (store.game.orgasms < maximumOrgasms && chance(70)) {
    setStrokeSpeed(randomStrokeSpeed());
    strokerRemoteControl.play();
    createNotification("Start stroking again");
    play(audioLibrary.StartStrokingAgain);
    await delay(3000);
  } else {
    setStrokeSpeed(0);
    stopGame();
  }
};

/**
 * let the user edge and hold 30s and then let him have the initially specified ending (ruin, denied or orgasm)
 *
 * @returns {Promise<function(): *[]>}
 */
const orgasm = async () => {
  const notificationId = await getToTheEdge();

  const trigger = async () => {
    dismissNotification(notificationId);
    await edging(30);
    return await determineOrgasm();
  };
  trigger.label = "Edging";

  return trigger;
};

const orgasmInTime = async () => {
  const notificationId = await getToTheEdge();

  const trigger = async () => {
    dismissNotification(notificationId);
    await edging(30);
    return await determineOrgasm();
  };
  trigger.label = "Edging";

  return trigger;
};

export default orgasmInTime;
