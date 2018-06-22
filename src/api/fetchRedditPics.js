// import fetchErome from "./fetchErome";
import fetchGfycat from "./fetchGfycat"

let after = {};

const fetchRedditPics = id => {
  return fetch(
    `https://www.reddit.com/r/${encodeURIComponent(id)}/hot/.json?after=${
      after[id] || ""
    }`
  )
    .then(response => response.json())
    .then(({ data }) => {
      after[id] = data.after;

      const images = data.children.map(
        ({ data: post }) => {
          switch (post.domain){
            case "gfycat.com": {
               return fetchGfycat(post.url);
            }
            case "erome.com": {
              return null; // fetchErome(post.url)
            }
            default: {
              return null;
            }
          }
        }
      );

      return Promise.all(images.filter(image => !!image));
    })
    .catch(error => console.error(error));
};

export default fetchRedditPics;
