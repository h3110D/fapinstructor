import fetchJsonp from "fetch-jsonp";

/**
 * fetches images from tumblr
 */
const limit = 50;
let offset = 0;
const fetchTumblrPics = (tumblrId, imageType) => {
  return fetchJsonp(
    `https://${encodeURIComponent(
      tumblrId
    )}.tumblr.com/api/read/json?num=${limit}&start=${offset}`
  )
    .then(response => response.json())
    .then(({ posts }) => {
      offset += 50;

      const images = posts
        .map(post => {
          let result;

          switch (post.type) {
            case "video":
              const src = /src="([^"]+)/.exec(post["video-player-500"])[1];
              const extension = /type="([^"]+)/
                .exec(post["video-player-500"])[1]
                .split("/")
                .pop();

              result = `${src}.${extension}`;
              break;
            case "photo":
              result = post["photo-url-1280"];
              break;
            default:
              result = null;
          }

          return result;
        })
        .filter(image => !!image);

      debugger;
      return images;
    })
    .catch(error => console.error(error));
};

export default fetchTumblrPics;
