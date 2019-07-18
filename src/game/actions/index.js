import createProbability from "../utils/createProbability";
import doubleStrokes from "./speed/doubleStrokes";
import halvedStrokes from "./speed/halvedStrokes";
import teasingStrokes from "./speed/teasingStrokes";
import randomStrokeSpeed from "./speed/randomStrokeSpeed";
import randomBeat from "./speed/randomBeat";
import redLightGreenLight from "./speed/redLightGreenLight";
import clusterStrokes from "./speed/clusterStrokes";
import randomGripAdjustment from "./grip";
import { addRubberBand, removeRubberBand, snapRubberBand } from "./cbt/rubberband";
import { addClothespin, removeClothespin } from "./nipple/clothespin";
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
import {
  setStrokeStyleBothHands,
  setStrokeStyleDominant,
  setStrokeStyleHeadOnly,
  setStrokeStyleNondominant,
  setStrokeStyleOverhandGrip,
  setStrokeStyleShaftOnly
} from "game/enums/StrokeStyle";
import eatPrecum from "./cei/eatPrecum";
import { insertButtPlug, removeButtPlug } from "./anal/buttPlug";
import pickYourPoison from "./pickYourPoison";
import acceleration from "./speed/acceleration";
import rubNipples from "./nipple/rubNipples.js";
import nipplesAndStroke from "./nipple/nipplesAndStroke";
import handsOff from "game/actions/speed/handsOff";

const initializeActions = taskConfigs =>
  // We use a task configuration to determine if the task is active. We will get to this in the next step.
  // createProbability takes your action and the probability percentage the action will be invoked
  [
    // speed
    taskConfigs.halvedStrokes && createProbability(halvedStrokes, 5),
    taskConfigs.doubleStrokes && createProbability(doubleStrokes, 15),
    taskConfigs.teasingStrokes && createProbability(teasingStrokes, 10),
    // taskConfigs.randomBeat && createProbability(randomBeat, 10),
    taskConfigs.randomStrokeSpeed && createProbability(randomStrokeSpeed, 20),
    // taskConfigs.accelerationCycles && createProbability(acceleration, 7),
    // taskConfigs.redLightGreenLight && createProbability(redLightGreenLight, 7),
    // taskConfigs.clusterStrokes && createProbability(clusterStrokes, 7),
    taskConfigs.handsOff && createProbability(handsOff, 5),
    // cbt
    taskConfigs.rubberBands && createProbability(addRubberBand, 2),
    taskConfigs.rubberBands && createProbability(removeRubberBand, 1),
    taskConfigs.icyHot && createProbability(applyIcyHot, 1),
    taskConfigs.toothpaste && createProbability(applyToothpaste, 1),
    taskConfigs.ballSlaps && createProbability(ballslaps, 4),
    taskConfigs.squeezeBalls && createProbability(squeezeBalls, 4),
    taskConfigs.headPalming && createProbability(headPalming, 1),
    taskConfigs.bindCockBalls && createProbability(bindCockAndBalls, 1),
    taskConfigs.rubberBands && createProbability(snapRubberBand, 1),
    taskConfigs.breathPlay && createProbability(holdBreath, 1),
    taskConfigs.scratching && createProbability(scratchChest, 1),
    taskConfigs.scratching && createProbability(scratchThighs, 1),
    taskConfigs.scratching && createProbability(scratchShoulders, 1),
    taskConfigs.flicking && createProbability(flickCockHead, 1),
    taskConfigs.flicking && createProbability(flickNipples, 1),
    taskConfigs.cbtIce && createProbability(rubIceOnBalls, 1),
    // stroke grip
    taskConfigs.gripAdjustments && createProbability(randomGripAdjustment, 30),
    // stroke style
    taskConfigs.dominant && createProbability(setStrokeStyleDominant, 10),
    taskConfigs.nondominant && createProbability(setStrokeStyleNondominant, 5),
    taskConfigs.headOnly && createProbability(setStrokeStyleHeadOnly, 1),
    taskConfigs.shaftOnly && createProbability(setStrokeStyleShaftOnly, 3),
    taskConfigs.overhandGrip && createProbability(setStrokeStyleOverhandGrip, 1),
    taskConfigs.bothHands && createProbability(setStrokeStyleBothHands, 10),
    // anal
    taskConfigs.buttplug && createProbability(insertButtPlug, 1),
    taskConfigs.buttplug && createProbability(removeButtPlug, 1),
    // cei
    taskConfigs.precum && createProbability(eatPrecum, 3),
    // nipples
    taskConfigs.clothespins && createProbability(addClothespin, 3),
    taskConfigs.clothespins && createProbability(removeClothespin, 1),
    taskConfigs.rubNipples && createProbability(rubNipples, 5),
    taskConfigs.nipplesAndStroke && createProbability(nipplesAndStroke, 10),
    // misc.
    taskConfigs.pickYourPoison && createProbability(pickYourPoison, 15),
  ].filter(action => !!action);

export default initializeActions;
