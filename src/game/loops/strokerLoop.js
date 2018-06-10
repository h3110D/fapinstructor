import store from "store";
import play, { playTick } from "engine/audio";
import audioLibrary from "audio";
import remoteControl from "./remoteControl";

let lastStroke = 0;

export const strokerRemoteControl = Object.create(remoteControl);

const strokerLoop = progress => {
  if (!strokerRemoteControl.paused) {
    const { strokeSpeed } = store.game;

    if (strokeSpeed > 0) {
      if (lastStroke > 1 / strokeSpeed * 1000) {
        if (!playTick(strokeSpeed)) {
          // play(audioLibrary.Tick);
        }
        store.game.strokeWave.push(lastStroke);
        store.game.strokes++;
        lastStroke = 0;
      } else {
        lastStroke += progress;
      }
    }
  }
};

strokerLoop.onSubscribe = () => {
  lastStroke = 0;
};

export default strokerLoop;
