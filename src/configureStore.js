import store from "store";
import {GripStrengthEnum} from "game/enums/GripStrength";

/**
 * A big enum containing all setup information of the game.
 *
 * @since 08.07.2018
 */
const defaultConfig = {
  version: 2,
  tumblrId: "fapstergifs, allcowgirl, mar-cuss-blowjob-gifs",
  failedIds: [],
  redditId: "60fpsporn, porninaminute",
  gifs: true,
  pictures: false,
  videos: true,
  slideDuration: 10, // sec
  enableVoice: true,
  enableMoans: true,
  videoMuted: false,
  finalOrgasmAllowed: true,
  finalOrgasmDenied: false,
  finalOrgasmRuined: false,
  finalOrgasmRandom: false,
  minimumGameTime: 5, // min
  maximumGameTime: 20, // min
  minimumEdges: 0,
  minimumRuinedOrgasms: 0,
  maximumRuinedOrgasms: 0,
  maximumOrgasms: 1,
  postOrgasmTorture: false,
  postOrgasmTortureMinimumTime: 10,
  postOrgasmTortureMaximumTime: 90,
  edgeCooldown: 5, // sec
  edgeFrequency: 0, // percent
  ruinCooldown: 20, // sec
  slowestStrokeSpeed: 0.25, // sec
  fastestStrokeSpeed: 5, // sec
  initialGripStrength: GripStrengthEnum.Normal,
  actionFrequency: 5, // sec
  tasks: {
    //Stroke Speed
    doubleStrokes: true,
    halvedStrokes: true,
    teasingStrokes: true,
    accelerationCycles: true,
    randomBeat: true,
    randomStrokeSpeed: true,
    redLightGreenLight: true,
    clusterStrokes: true,
    //Stroke Style
    dominant: true,
    nondominant: true,
    headOnly: true,
    shaftOnly: true,
    overhandGrip: true,
    bothHands: true,
    handsOff: true,
    //Grip Strength
    gripAdjustments: true,
    //CBT
    bindCockBalls: true,
    rubberBands: true,
    ballSlaps: true,
    squeezeBalls: true,
    headPalming: true,
    icyHot: true,
    toothpaste: true,
    breathPlay: true,
    scratching: true,
    flicking: true,
    cbtIce: true,
    precum: true,
    //Anal
    buttplug: true,
    //Nipples
    rubNipples: true,
    clothespins: true,
    nipplesAndStroke: true,
    //Misc
    pickYourPoison: true
  }
};

export default () => {
  store.config = defaultConfig;
  return store;
};
