import store from "store";
import play from "engine/audio";
import audioLibrary from "audio";
import createNotification, { dismissNotification } from "engine/createNotification";
import { getRandomInclusiveInteger } from "utils/math";
import delay from "utils/delay";
import { edging, getToTheEdge, stopEdging } from "game/actions/orgasm/edge";
import punishment from "../punishment";
import {
  getRandom_edgeAdvanced_message,
  getRandom_edgeInTime_message,
  getRandom_edgeLadder_message,
  getRandom_hurryUp_message
} from "game/texts/messages";
import executeAction from "engine/executeAction";
import edge from "./edge";
import createProbability from "game/utils/createProbability";
import { applyProbability } from "game/actions/generateAction";
import handsOff from "../speed/handsOff";

/**
 * Fetches one of all edges.
 * Difficulty: mostly Easy
 * @returns {action}
 *   A random action
 */
const getRandomEdge = () => {
  const chosenActions = initializeEdges();
  return applyProbability(chosenActions, 1)[0];
};

/**
 * Fetches one of all edges.
 * Difficulty: mostly Hard
 * @returns {action}
 *   A random action
 */
const getRandomFinalLadderEdge = () => {
  const chosenActions = initializeEdges();
  return applyProbability(chosenActions, 1)[0];
};

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


export const introduceEdgingLadder = async () => {
  createNotification(getRandom_edgeLadder_message());
};

/**
 * A task where the user has to do a certain amount of edges in a short time span.
 *
 * @param edgeLadderRung
 *   the current running rung of the edge ladder.
 * @param numberOfEdges
 *   the number of Edges the user has to do.
 * @param numberOfCooldowns
 *   the number of HandsOff tasks the user already did.
 * @returns {Promise<void>}
 */
export const edgingLadder = async (edgeLadderRung = store.game.edgingLadderRung,
                                   numberOfEdges = store.game.edgingLadderLength,
                                   numberOfCooldowns = store.game.edgingLadderCooldowns) => {

  if (edgeLadderRung >= numberOfEdges) {
    store.game.edgingLadder = false;
  }
  if (numberOfCooldowns * 4 < edgeLadderRung) {
    store.game.edgingLadderCooldowns++;
    await handsOff(30);
  }
  else {
    if (edgeLadderRung <= 1) {
      await executeAction(edge);
    }
    else if (edgeLadderRung <= numberOfEdges / 2) {
      await executeAction(getRandomEdge());
    }
    else {
      await executeAction(getRandomFinalLadderEdge());
    }
    store.game.edgingLadderRung++;
  }
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
  const trigger_edging = async () => {
    edged = true;
    dismissNotification(notificationId);
    dismissNotification(timerId);
    await edging();
    await stopEdging();
  };
  trigger_edging.label = "Edging";

  const countdown = async () => {
    await delay((timer + 1) * 1000);  // Wait till the timer runs up
    // now check whether user did reach the edge in time
    if (!edged) {
      dismissNotification(notificationId);
      dismissNotification(timerId);
      executeAction(punishment, true); // Interrupts other action (trigger_edging)
    }

  };

  const timerId = createNotification(getRandom_hurryUp_message(), {
    time: timer * 1000
  });

  countdown();  // don't wait for the promise just start the thread.

  return [trigger_edging];
};

export const edgeAdvancedInTime = async (timer = getRandomInclusiveInteger(20, 60)) => {
  return edgeInTime(timer, getToTheEdgeAdvanced)
};

/**
 * Manually created list of all edges:
 * createProbability takes your action and the probability percentage the action will be invoked
 * as a edge.
 *
 * @returns {*[]}
 *   an array with all the function-probability pairs: {func, probability}
 */
export const initializeEdges = () =>
  [
    // list of all available edges
    createProbability(edge, 50),
    createProbability(edgeAdvanced, 50),
    createProbability(edgeInTime, 10),
    createProbability(edgeAdvancedInTime, 10),
  ].filter(action => !!action);

/**
 * Manually created list of all edges with probabilities required in final edgeLadder phase:
 * createProbability takes your action and the probability percentage the action will be invoked
 * as a edge in edge ladder.
 *
 * @returns {*[]}
 *   an array with all the function-probability pairs: {func, probability}
 */
export const initializeFinalLadderEdges = () =>
  [
    // list of all available edges
    createProbability(edge, 10),
    createProbability(edgeAdvanced, 50),
    createProbability(edgeInTime, 50),
    createProbability(edgeAdvancedInTime, 50),
  ].filter(action => !!action);

