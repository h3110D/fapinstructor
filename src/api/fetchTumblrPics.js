import fetchJsonp from "fetch-jsonp";
<<<<<<< HEAD
import createNotification from "engine/createNotification";
import store from "store";
=======
import store from "store";

const limit = 50;
let offset = {};
const fetchTumblrPics = tumblrId => {
  const { pictures, gifs, videos } = store.config;
>>>>>>> cbcdcf1adb5e6e6870279450fef42710c1ae755b

  return fetchJsonp(
    `https://${encodeURIComponent(
      tumblrId
    )}.tumblr.com/api/read/json?num=${limit}&start=${offset[tumblrId] || ""}`
  )
<<<<<<< HEAD
  .then(response => response.json())
  .then(({ posts }) => {
      return [].concat
        .apply([], posts.map(post => post["photo-url-1280"]))
        .filter(url => {
          if (imageType.pictures && imageType.gifs) {
            return url;
          }
=======
    .then(response => response.json())
    .then(({ posts }) => {
      offset[tumblrId] += 50;
>>>>>>> cbcdcf1adb5e6e6870279450fef42710c1ae755b

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

<<<<<<< HEAD
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
=======
          return result;
        })
        .filter(image => !!image);
>>>>>>> cbcdcf1adb5e6e6870279450fef42710c1ae755b

      return images;
    })
    .catch(error => console.error(error));
};

export default fetchTumblrPics;
