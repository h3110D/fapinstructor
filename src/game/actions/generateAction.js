import store from "store";
import ActionIterator from "engine/actionIterator";
import { getRandomInclusiveInteger } from "utils/math";
import initializeActions from "./index";
import edge, { shouldEdge } from "./orgasm/edge";
import ruin, { shouldRuin } from "./orgasm/ruin";
import orgasm, { shouldOrgasm } from "./orgasm/orgasm";
import _ from "lodash";
import { edgeAdvanced, edgeAdvancedInTime, edgeInTime, edgingLadder, introduceEdgingLadder } from "./orgasm/edgeInTime";
import { chance } from "../../utils/math";


/**
 * retrieves a set of random actions
 *
 * @param count
 *   the length of the set
 * @returns {any | Array}
 */
export const getRandomActions = (count = 0) => {
  //Take only actions from src/configureStore.js and initialize them with probabilities from actions/index.js
  const actions = initializeActions(store.config.tasks);

  return applyProbability(actions, count);
};

/**
 * Applies the probability specified in index.js to each action.
 * Can also apply different probabilities like those from punishment.js for example.
 *
 * @param actions
 *   the {func, probability} pairs created by the initializeActions functionality
 * @param count
 *   the number of elements that shall be generated
 * @returns {any | [action]}
 *   an array of actions and maybe an empty array if count === 0
 */
export const applyProbability = (actions, count = 0) => {
  // applies the probability to each action
  let chosenActions = [];
  do {
    chosenActions = chosenActions.concat(
      actions.reduce((accumulator, action) => {
        const rand = getRandomInclusiveInteger(1, 100);
        if (rand <= action.probability) {
          accumulator.push(action.func);
        }
        return accumulator;
      }, [])
    );
  } while (chosenActions.length < count);

  chosenActions = _.shuffle(chosenActions);

  if (count) {
    chosenActions = count > 0 ? chosenActions.slice(0, count) : chosenActions;
  }

  return chosenActions;
};


/**
 * Determines whether the user should orgasm, edge or ruin. If none of the three applies a random action from the
 * initial setup is chosen.
 *
 * @returns {*} action - the next action that will be executed and displayed
 */
const generateAction = () => {

  let action = null;

  if (shouldOrgasm()) {
    action = orgasm;
  }

  else if (store.game.edgingLadder) {
    action = edgingLadder;
  }

  else if (shouldEdge()) {
    action = edge;
    if (store.config.advancedEdging && chance(75)) {
      if (chance(60)) {
        action = edgeAdvanced;
      } else if (chance(60)) {
        action = edgeInTime;
      } else if (chance(60)) {
        action = edgeAdvancedInTime;
      } else {
        store.game.edgingLadder = true;
        if (store.config.minimumEdges > 3) {
          store.game.edgingLadderLength = getRandomInclusiveInteger(3, store.config.minimumEdges);
        } else {
          store.game.edgingLadderLength = 3;
        }
        action = introduceEdgingLadder;
      }
    }
  }

  else if (shouldRuin()) {
    action = ruin;
  }

  else {
    const chosenActions = getRandomActions();

    // get one of the chosen actions
    action =
      chosenActions[getRandomInclusiveInteger(0, chosenActions.length - 1)];
  }

  return action;


};

/**
 * Create an ActionIterator using a action generator
 */
export default new ActionIterator(generateAction);
