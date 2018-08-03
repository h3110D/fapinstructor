import store from "store";
import executeAction from "engine/executeAction";
import createProbability from "../utils/createProbability";
import { addRubberBand, snapRubberBand } from "./cbt/rubberband";
import { addClothespin } from "./nipple/clothespin";
import applyIcyHot from "./cbt/icyhot";
import applyToothpaste from "./cbt/toothpaste";
import ballslaps from "./cbt/ballslaps";
import squeezeBalls from "./cbt/squeezeBalls";
import headPalming from "./cbt/headPalming";
import bindCockAndBalls from "./cbt/bindCockAndBalls";
import holdBreath from "./cbt/holdBreath";
import { scratchChest, scratchShoulders, scratchThighs } from "./cbt/scratching";
import { flickCockHead, flickNipples } from "./cbt/flicking";
import { rubIceOnBalls } from "./cbt/ice";
import eatPrecum from "./cei/eatPrecum";
import { insertButtPlug } from "./anal/buttPlug";
import handsOff from "game/actions/speed/handsOff";
import { applyProbability } from "./generateAction";


/**
 * Fetches one of all activated punishments.
 * @returns {action}
 *   A random action
 */
const getRandomPunishment = () => {

  const chosenActions = initializePunishments(store.config.tasks);
  return applyProbability(chosenActions, 1)[0];
};

/**
 * Task that chooses a random punishment from all available
 *
 * @since      03.08.2018
 * @author     the1nstructor
 *
 * @alias      punishment
 * @memberof   actions
 */
const punishment = async () => {

  const punish = getRandomPunishment();
  await executeAction(punish);
};
punishment.label = "Punishment";

/**
 * Manually created list of all punishments:
 * We use a task configuration to determine if the task is active. We will get to this in the next step.
 * createProbability takes your action and the probability percentage the action will be invoked as a punishment.
 *
 * @param taskConfigs
 *   the configuration file (usually store.config.tasks)
 * @returns {*[]}
 *   an array with all the function-probability pairs: {func, probability}
 */
export const initializePunishments = (taskConfigs = store.config.tasks) =>
  [
    // speed
    createProbability(handsOff, 33), // is always included
    // cbt
    taskConfigs.rubberBands && createProbability(addRubberBand, 50),
    taskConfigs.icyHot && createProbability(applyIcyHot, 10),
    taskConfigs.toothpaste && createProbability(applyToothpaste, 25),
    taskConfigs.ballSlaps && createProbability(ballslaps, 10),
    taskConfigs.squeezeBalls && createProbability(squeezeBalls, 15),
    taskConfigs.headPalming && createProbability(headPalming, 5),
    taskConfigs.bindCockBalls && createProbability(bindCockAndBalls, 50),
    taskConfigs.rubberBands && createProbability(snapRubberBand, 33),
    taskConfigs.breathPlay && createProbability(holdBreath, 20),
    taskConfigs.scratching && createProbability(scratchChest, 10),
    taskConfigs.scratching && createProbability(scratchThighs, 10),
    taskConfigs.scratching && createProbability(scratchShoulders, 5),
    taskConfigs.flicking && createProbability(flickCockHead, 40),
    taskConfigs.flicking && createProbability(flickNipples, 50),
    taskConfigs.cbtIce && createProbability(rubIceOnBalls, 33),
    // anal
    taskConfigs.buttplug && (!store.game.buttPlugInserted) && createProbability(insertButtPlug, 45),
    // cei
    taskConfigs.precum && createProbability(eatPrecum, 15),
    // nipples
    taskConfigs.clothespins && store.game.clothespins < 2 && createProbability(addClothespin, 50),
  ].filter(action => !!action);

export default punishment;
