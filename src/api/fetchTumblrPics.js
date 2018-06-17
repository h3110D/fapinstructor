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
    )}.tumblr.com/api/read/json?num=${limit}&type=photo&start=${offset}`
  )
    .then(response => response.json())
    .then(({ posts }) => {
      offset += 50;

      const images = [].concat
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

      return images;
    })
    .catch(error => console.error(error));
};

export default fetchTumblrPics;
