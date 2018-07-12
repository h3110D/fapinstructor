import fetchJsonp from "fetch-jsonp";
import store from "store";
import createNotification from "engine/createNotification";

const limit = 50;
let offset = {};
const fetchTumblrPics = tumblrId => {
  const { pictures, gifs, videos } = store.config;

  return fetchJsonp(
    `https://${encodeURIComponent(
      tumblrId
    )}.tumblr.com/api/read/json?num=${limit}&start=${offset[tumblrId] || ""}`
  )
    .then(response => response.json())
    .then(({ posts }) => {
      offset[tumblrId] += 50;

      const images = posts
        .map(post => {
          let result;

          switch (post.type) {
            case "video":
              if (videos) {
                const src = /src="([^"]+)/.exec(post["video-player-500"])[1];
                const extension = /type="([^"]+)/
                  .exec(post["video-player-500"])[1]
                  .split("/")
                  .pop();

                result = `${src}.${extension}`;
              }
              break;
            case "photo":
              const url = post["photo-url-1280"];

              if (url.endsWith(".gif")) {
                if (gifs) {
                  result = url;
                }
              } else if (pictures) {
                result = url;
              }
              break;
            default:
              result = null;
          }

          return result;
        })
        .filter(image => !!image);

      return images;
    })
    .catch((error) => {
      if(tumblrId && !store.config["failedIds"].includes(tumblrId)){
         const tumblrIds = store.config["tumblrId"];
         let ids = tumblrIds.split(",").map(id => id.trim());

         ids.splice(ids.indexOf(tumblrId), 1);

         store.config["tumblrId"] = ids.join(",");
         store.config["failedIds"].push(tumblrId);

         createNotification(`${tumblrId} failed to retrieve and will not be included in this game.`, {}, false);
      }
      return [];
    });
};

export default fetchTumblrPics;