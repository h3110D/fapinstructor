import shuffle from "lodash.shuffle";
import uniq from "lodash.uniq";
import store from "store";
import fetchTumblrPics from "api/fetchTumblrPics";
import fetchRedditPics from "api/fetchRedditPics";

export const nextSlide = async () => {
  if (store.game.mediaFrozen) {
    return;
  }

  // load more pictures when close to running out
  if (5 > store.game.pictures.length - store.game.pictureIndex) {
    await fetchPictures();
  }

  store.game.pictureIndex++;

  // set the active picture to a fetched image
  store.game.mediaPlayerUrl = store.game.pictures[store.game.pictureIndex];
};

const fetchPictures = async () => {
  const { tumblrId, redditId } = store.config;

  const tumblrIds =
    tumblrId.length > 0 && tumblrId.split(",").map(id => id.trim());
  const redditIds =
    redditId.length > 0 && redditId.split(",").map(id => id.trim());

  let fetches = [];

  if (tumblrIds) {
    fetches = fetches.concat(tumblrIds.map((id, index) => fetchTumblrPics(id)));
  }
  if (redditIds) {
    fetches = fetches.concat(
      redditIds.map((id, index) => fetchRedditPics(redditIds[0]))
    );
  }

  // execute the array of promises and append the randomized pictures to the global array
  return Promise.all(fetches).then(results => {
    let newImages = [];

    results.forEach(images => {
      newImages = newImages.concat(images);
    });
    store.game.pictures = [...store.game.pictures, ...uniq(shuffle(newImages))];

    if (newImages.length === 0) {
      store.game.pictureIndex = 0;
    }
  });
};

export default fetchPictures;
