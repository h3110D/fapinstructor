import fetchJsonp from "fetch-jsonp";
import store from "store";
import createNotification from "engine/createNotification";
import { OrderEnum } from "game/enums/Order";

const limit = 50;
let count = [];;
let offset = {};
const fetchTumblrPics = tumblrId => {
  const { order, pictures, gifs, videos } = store.config;

  const tagsRegex = /\[(.*?)\]/g;
  let tagMatch = tagsRegex.exec(tumblrId);
  let tag = "";
  while (tagMatch != null) {
    tag = tagMatch[1];
    tumblrId = tumblrId.replace(tagsRegex, "");
    tagMatch = tagsRegex.exec(tumblrId);
  }
  tag.replace(" ", "+");

  let type = "";
  if ((pictures || gifs) && !videos) type = "photo"
  else if (videos && !pictures && !gifs) type = "video";

  let nextOffset;
  if (order === OrderEnum.Random) {
    if (count[tumblrId] === undefined) {
      offset[tumblrId] = [];
      return fetchJsonp(
        `https://${encodeURIComponent(
          tumblrId
        )}.tumblr.com/api/read/json?num=0&tagged=${tag}`
      )
        .then(response => response.json())
        .then(({ 'posts-total': total }) => {
          count[tumblrId] = total;
          return fetchTumblrPics(tumblrId);
        });
    }

    do {
      nextOffset = Math.round(Math.random() * (count[tumblrId] / limit - 1)) * limit;
    }
    while (offset[tumblrId].indexOf(nextOffset) > -1)
    offset[tumblrId].push(nextOffset);
  } else {
    if (offset[tumblrId]) nextOffset = offset[tumblrId] + limit;
    else nextOffset = 0;
    offset[tumblrId] = nextOffset;
  }

  return fetchJsonp(
    `https://${encodeURIComponent(
      tumblrId
    )}.tumblr.com/api/read/json?num=${limit}&start=${nextOffset}&tagged=${tag}&type=${type}`
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