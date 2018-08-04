import store from "store";
import actionIterator from "engine/actionIterator";
import { getRandomInclusiveInteger } from "utils/math";
import initializeActions from "./index";
import edge, { shouldEdge } from "./orgasm/edge";
import ruin, { shouldRuin } from "./orgasm/ruin";
import orgasm, { shouldOrgasm } from "./orgasm/orgasm";
import _ from "lodash";
import { edgeAdvanced, edgeAdvancedInTime, edgeInTime } from "./orgasm/edgeInTime";
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
 * TODO @thefapinstructor please create docu for this
 *
 * @returns {*}
 */
const generateAction = () => {
  let action = null;

  if (shouldOrgasm()) {
    action = orgasm;
  } else if (shouldEdge()) {
    action = edge;
  } else if (shouldRuin()) {
    action = ruin;
  } else {
    const chosenActions = getRandomActions();

    // get one of the chosen actions
    action =
      chosenActions[getRandomInclusiveInteger(0, chosenActions.length - 1)];
  }

  return action;
};

/**
 * Create an actionIterator using a action generator
 */
export default new actionIterator(generateAction);
