import fetchJsonp from "fetch-jsonp";
import store from "store";
import createNotification from "engine/createNotification";

/**
 * @todo Add Tumblr API key
 */
const apiKey = "";

const limit = 20;
let offset = {};
const fetchTumblrPics = tumblrId => {
  const { pictures, gifs, videos } = store.config;

  let tagsRegex = /\[(.*?)\]/g;
  let tagMatch = tagsRegex.exec(tumblrId);
  let tag = "";
  while (tagMatch != null) {
    tag = tagMatch[1];
    tumblrId = tumblrId.replace(tagsRegex, "");
    tagMatch = tagsRegex.exec(tumblrId);
  }
  tag.replace(" ", "+");

  let postType = "";
  if ((pictures || gifs) && !videos) postType = "photo";
  else if (videos && !pictures && !gifs) postType = "video";

  return fetchJsonp(
    `https://api.tumblr.com/v2/blog/${encodeURIComponent(
      tumblrId
    )}/posts/${postType}?api_key=${apiKey}${tag ? "&tag=" + tag : ""}&limit=${limit}&offset=${offset[tumblrId] || 0}`
  )
    .then(response => response.json())
    .then(({ response: { posts } }) => {
      offset[tumblrId] += limit;

      const images = posts
        .map(post => {
          let result;

          switch (post.type) {
            case "video":
              if (videos) {
                // Find video source closest to the window width
                let closestDeltaWidth = Infinity;
                let bestVideoSource = null;
                post.player.forEach((source) => {
                  const deltaWidth = Math.abs(window.innerWidth - source.width);
                  if (deltaWidth < closestDeltaWidth) {
                    closestDeltaWidth = deltaWidth;
                    bestVideoSource = source;
                  }
                });

                const src = /src="([^"]+)/.exec(bestVideoSource.embed_code)[1];
                const extension = /type="([^"]+)/
                  .exec(bestVideoSource.embed_code)[1]
                  .split("/")
                  .pop();

                result = `${src}.${extension}`;
              }
              break;
            case "photo":
              post.photos.forEach((photo) => {
                // Find photo of a size closest to the window width
                let closestDeltaWidth = Infinity;
                let bestSizePhoto = null;
                photo.alt_sizes.forEach((option) => {
                  const deltaWidth = Math.abs(window.innerWidth - option.width);
                  if (deltaWidth < closestDeltaWidth) {
                    closestDeltaWidth = deltaWidth;
                    bestSizePhoto = option;
                  }
                });

                const url = bestSizePhoto.url;
                if (url.endsWith(".gif")) {
                  if (gifs) {
                    result = url;
                  }
                } else if (pictures) {
                  result = url;
                }
              });
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