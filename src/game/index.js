/**
 * The entry point to kick start and configure the game
 */
import { subscribe, unsubscribe } from "engine/loop";
import interrupt from "engine/interrupt";
import { createAudioContext } from "engine/audio";
import store from "store";
import configureStore from "./configureStore";
import actionLoop from "./loops/actionLoop";
import strokerLoop from "./loops/strokerLoop";
import { nextSlide } from "./utils/fetchPictures";
import moanLoop from "./loops/moanLoop";
import * as spotify from 'api/spotify';

let loops = [];

const addLoops = (...newLoops) => {
  newLoops.forEach(loop => {
    loops.push(subscribe(loop));
  });
};

const startGame = () => {
  configureStore();
  createAudioContext();
  await nextSlide();
  if (store.config.enableSpotify) await spotify.findPlaySync();
  addLoops(strokerLoop, actionLoop, moanLoop);
};

const stopGame = () => {
  interrupt();
  loops.forEach(loop => {
    unsubscribe(loop);
  });
  loops = [];
};

export { startGame, stopGame };
