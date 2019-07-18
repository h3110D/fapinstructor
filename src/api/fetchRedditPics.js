import store from "store";
import createNotification from "engine/createNotification";
import { OrderEnum } from "game/enums/Order";

import fetchGfycat from "./fetchGfycat"
// import fetchErome from "./fetchErome";
import fetchImgur from "./fetchImgur";
import fetchImgurDirectLink from "./fetchImgur";
import fetchVReddit from "./fetchVReddit";
import fetchIReddit from "./fetchIReddit";
import fetchGiphy from "./fetchGiphy";

const reflect = p => p.then(
  value => ({ value, resolved: true }),
  reason => ({ reason, resolved: false }),
);

const endpoints = {
  [OrderEnum.Random]: "random",
  [OrderEnum.New]: "new",
  [OrderEnum.Hot]: "hot",
};
let after = {};

const extractRedditPic = (post) => {
  if (!post.url) return Promise.reject('Reddit post has no url');
  switch (post.domain){
    case "gfycat.com": {
       return fetchGfycat(post.url);
    }
    case "erome.com": {
      return null; // fetchErome(post.url)
    }
    case "i.imgur.com": {
      return fetchImgurDirectLink(post.url);
    }
    case "imgur.com": {
      return fetchImgur(post.url);
    }
    case "i.redd.it": {
      return fetchIReddit(post);
    }
    case "v.redd.it": {
      return fetchVReddit(post);
    }
    case "giphy.com":
    case "media.giphy.com":
    case "i.giphy.com": {
      return fetchGiphy(post.url);
    }
    case "66.media.tumblr.com": {
      return post.url;
    }
    default: {
      return Promise.reject('Couldn\'t handle domain');
    }
  }
};

const fetchRedditPics = (id, limit) => {
  let url;
  if (id.search('/') === -1) {
    url = `https://www.reddit.com/r/${encodeURIComponent(id)}/${endpoints[store.config.order]}/.json?after=${after[id] || ""}&limit=${limit}`;
  } else if (id.search(/\?/) === -1) {
    url = `https://www.reddit.com${id.replace(/\/$/, '')}/.json?after=${after[id] || ""}&limit=${limit}`;
  } else {
    url = `https://www.reddit.com${id.replace(/\/?\?/, '/.json?')}&after=${after[id] || ""}&limit=${limit}`;
  }

  let promise;
  if (store.config.order === OrderEnum.Random) {
    let fetchPromises = [];
    for (let i = 0; i < limit; i++) {
      fetchPromises.push(fetch(url));
    }
    promise = Promise.all(fetchPromises.map(reflect))
      .then(values => Promise.all(
          values
            .filter(({ resolved }) => resolved)
            .map(({ value }) => value.json())
        ),
      )
      .then((values) => {
        const images = values.filter(value => !value.error).map(feeds => 
          (feeds instanceof Array ? feeds : [feeds]).map(({ data }) =>
            data.children.map(
              ({ data: post }) => extractRedditPic(post),
            ),
          ),
        )
          .flat(2);

        return Promise.all(images.map(reflect));
      });
  } else {
    promise = fetch(url)
      .then(response => response.json())
      .then(({ data }) => {
        after[id] = data.after;

        const images = data.children.map(
          ({ data: post }) => extractRedditPic(post),
        );

        return Promise.all(images.map(reflect));
      });
  }

  return promise
    .then(results => results.filter(({ resolved }) => resolved))
    .then(results => results.map(({ value }) => value))
    .then(images => images.flat())
    .then(images => images.filter(image => !!image))
    .then(images => images.slice(0, limit))
    .then(images => {
      if (images.length > 0) return images;
      if(id && !store.config["failedIds"].includes(id)){
        const redditIds = store.config["redditId"];
        let ids = redditIds.split(",").map(id => id.trim());

        ids.splice(ids.indexOf(id), 1);

        store.config["redditId"] = ids.join(",");
        store.config["failedIds"].push(id);

        createNotification(`${id} failed to retrieve and will not be included in this game.`, {}, false);
      }
      return [];
    });
};

export default fetchRedditPics;
