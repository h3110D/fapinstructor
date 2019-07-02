import shuffle from "lodash.shuffle";
import uniq from "lodash.uniq";
import store from "store";
import fetchTumblrPics from "api/fetchTumblrPics";
import fetchRedditPics from "api/fetchRedditPics";
import {fetchHumblrPicsByTag, fetchHumblrPicsByUser} from "api/fetchHumblrPics";

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
  const { tumblrId, redditId, humblrTag, humblrUser } = store.config;
  var splitOnCommaOutsideSqBr = /,(?![^[]*])/g;

  const tumblrIds =
    tumblrId.length > 0 && tumblrId.split(splitOnCommaOutsideSqBr).map(id => id.trim());
  const redditIds =
    redditId.length > 0 && redditId.split(splitOnCommaOutsideSqBr).map(id => id.trim());
  const humblrTags =
    humblrTag.length > 0 && humblrTag.split(splitOnCommaOutsideSqBr).map(tag => tag.trim());
  const humblrUsers =
    humblrUser.length > 0 && humblrUser.split(splitOnCommaOutsideSqBr).map(tag => tag.trim());

  if (tumblrIds instanceof Array) {
    tumblrIds.forEach((id, index) => {
      var tagsRegex = /\[(.*?)\]/g;
      var tagMatch = tagsRegex.exec(id);
      var tags = "";
      while (tagMatch != null) {
        tags = tagMatch[1];
        id = id.replace(tagsRegex, "");
        tagMatch = tagsRegex.exec(id);
      }

      tags = tags.split(",");
      tags.forEach((tag) => {
        tag.trim();
        tag.replace(" ", "+");
        let newTumblrId = id.concat(`[${tag}]`);
        tumblrIds.push(newTumblrId);
      });
    });
  }

  let fetches = [];

  if (tumblrIds) {
    fetches = fetches.concat(tumblrIds.map((id, index) => fetchTumblrPics(id)));
  }
  if (redditIds) {
    fetches = fetches.concat(
      redditIds.map((id, index) => fetchRedditPics(id))
    );
  }
  if (humblrTags) {
    fetches = fetches.concat(
      humblrTags.map((tag, index) => fetchHumblrPicsByTag(tag))
    );
  }
  if (humblrUsers) {
    fetches = fetches.concat(
      humblrUsers.map((tag, index) => fetchHumblrPicsByUser(tag))
    );
  }

  // execute the array of promises and append the randomized pictures to the global array
  return Promise.all(fetches).then(results => {
    let newImages = [];

    results.forEach(images => {
      if(!images) { return; }
      newImages = newImages.concat(images);
    });
    store.game.pictures = [...store.game.pictures, ...uniq(shuffle(newImages))];

    if (newImages.length === 0) {
      store.game.pictureIndex = 0;
    }
  });
};

export default fetchPictures;
