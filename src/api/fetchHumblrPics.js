import store from "store";

/*
  Access token for a dummy account on humblr.social
  Has only read access and the account is empty
  Read https://docs.joinmastodon.org/api/authentication/#example-authorization-code-flow
  or https://github.com/tootsuite/documentation/blob/master/Using-the-API/API.md#apps
  for further info
*/
const humblrClientToken = "2d3545ff64750211858384914ce2ce551af347f563ce82b97603c1f019554001";

const fetchHumblrPicsByTag = async (tag, limit) => {
  const { pictures, gifs, videos } = store.config;
  // just fetch images by tag, no auth token necessary
  return fetch(
    `https://humblr.social/api/v1/timelines/tag/${encodeURIComponent(tag)}?only_media=true&limit=${limit}`
  )
    .then(response => response.json())
    .then(data => {
      const images = data.map(post => {
        let attachedImages = post["media_attachments"].map(attachment => {
          let result;
          const type = attachment["type"];
          if ((type === "image" && pictures)
              || (type === "gifv" && gifs)
              || (type === "video" && videos)) {
            result = attachment["url"];
          }
          return result;
        });
        return attachedImages;
      })
      return [].concat.apply([], images).filter(image => !!image);
    })
  }

const fetchHumblrPicsByUser = async (user, limit) => {
  const { pictures, gifs, videos} = store.config;

  // first fetch user ID by name. We need an Auth Token for this
  let userId = await fetch(
    `https://humblr.social/api/v1/accounts/search?q=${encodeURIComponent(user)}&limit=1`,
    {headers:{'Authorization':`Bearer ${humblrClientToken}`}}
  )
    .then(response => response.json())
    .then(data => {
      if (data instanceof Array && data.length > 0 ) {
        return data[0]['id']
      } else {
        return -1;
      }
    });
  // if user didn't exist, return empty array
  if (userId === -1) return [];
  // fetch images of user. These might be empty if the user never posted any images
  // it would be possible to filter by tags here
  return fetch(
    `https://humblr.social/api/v1/accounts/${userId}/statuses?only_media=true&limit=${limit}`,
  )
    .then(response => response.json())
    .then(data => {
      const images = data.map(post => {
        let attachedImages = post["media_attachments"].map(attachment => {
          let result;
          const type = attachment["type"];
          if ((type === "image" && pictures)
              || (type === "gifv" && gifs)
              || (type === "video" && videos)) {
            result = attachment["url"];
          }
          return result;
        });
        return attachedImages;
      })
      return [].concat.apply([], images).filter(image => !!image);
    })
  }

export {fetchHumblrPicsByTag, fetchHumblrPicsByUser};
