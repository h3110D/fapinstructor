import store from "store";
import createNotification from "engine/createNotification";
import { strokerRemoteControl } from "game/loops/strokerLoop";
import { slideRemoteControl } from "game/loops/slideLoop";
import videoLibrary from "video";
import { getRandomInclusiveInteger } from "utils/math";

const bindCockAndBalls = async () => {
  if (!store.game.cockAndBallsBound) {
    strokerRemoteControl.pause();
    slideRemoteControl.pause();
    // pause images
    createNotification(`Bind your cock & balls`);

    const videos = [
      videoLibrary.CockBallsTie,
      videoLibrary.BallSeperation,
      videoLibrary.CockBallWrapping,
      videoLibrary.BallWrapping
    ];

    store.game.mediaPlayerUrl =
      videos[getRandomInclusiveInteger(0, videos.length - 1)];

    const done = async () => {
      strokerRemoteControl.play();
      slideRemoteControl.play();
      store.game.cockAndBallsBound = true;
    };
    done.label = "Bound";

    return [done];
  }
};
bindCockAndBalls.label = "Bind Cock & Balls";

export default bindCockAndBalls;
