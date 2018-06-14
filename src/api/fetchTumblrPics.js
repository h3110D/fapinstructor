import fetchJsonp from "fetch-jsonp";
import createNotification from "engine/createNotification";
import store from "store";

/**
 * fetches images from tumblr
 */
const fetchPics = (id, imageType, offset = 0, limit) => {
  return fetchJsonp(
    `https://${encodeURIComponent(id)}.tumblr.com/api/read/json?num=${limit}&type=photo&start=${offset}`
  )
  .then(response => response.json())
  .then(({ posts }) => {
      return [].concat
        .apply([], posts.map(post => post["photo-url-1280"]))
        .filter(url => {
          if (imageType.pictures && imageType.gifs) {
            return url;
          }

          if (imageType.pictures) {
            return !url.endsWith(".gif");
          }

          if (imageType.gifs) {
            return url.endsWith(".gif");
          }

          return url;
        });
  })
  .catch((error) => {
      if(id && !store.config["failedIds"].includes(id)){
         const { tumblrId } = store.config;
         let ids = tumblrId.split(",").map(id => id.trim());

         ids.splice(ids.indexOf(id), 1);

         store.config["tumblrId"] = ids.join(",");
         store.config["failedIds"].push(id);

         createNotification(`${id} failed to retrieve and will not be included in this game.`);
      }
    });
};

/**
 * A recursive fetch to tumblr as there is a limit of 50 images per api call
 */
const limit = 50;
const fetchManyPics = (id, imageType, offset = 0, images = [], recursiveCounter = 1) => {
  return fetchPics(id, imageType, offset, limit).then(urls => {
    images = images.concat(urls);
    return recursiveCounter === 0
      ? { images, offset }
      : fetchManyPics(id, imageType, offset + limit, images, --recursiveCounter);
  });
};

export default fetchManyPics;
