let after = "";

/**
 * fetches images from reddit
 */
const fetchRedditPics = id => {
  return fetch(
    `https://www.reddit.com/r/${encodeURIComponent(
      id
    )}/hot/.json?after=${after}`
  )
    .then(response => response.json())
    .then(({ data }) => {
      after = data.after;

      const posts = data.children.filter(
        ({ data: post }) => post.domain === "gfycat.com"
      );

      const images = posts.map(
        ({ data: post }) =>
          post.url.replace("gfycat.com", "giant.gfycat.com") + ".webm"
      );

      return images;
    })
    .catch(error => console.error(error));
};

export default fetchRedditPics;
