import store from "store";
import createNotification from "engine/createNotification";
import { strokerRemoteControl } from "game/loops/strokerLoop";
import videoLibrary from "video";
import { getRandomInclusiveInteger } from "utils/math";
import { nextSlide } from "game/utils/fetchPictures";

const bindCockAndBalls = async () => {
  if (!store.game.cockAndBallsBound) {
    strokerRemoteControl.pause();
    store.game.mediaFrozen = true;
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
      store.game.mediaFrozen = false;
      store.game.cockAndBallsBound = true;
      nextSlide();
    };
    done.label = "Bound";

    return [done];
  }
};
bindCockAndBalls.label = "Bind Cock & Balls";

export default bindCockAndBalls;
