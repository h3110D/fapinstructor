const fetchErome = (url) => (
  fetch(
   `https://cors-proxy.htmldriven.com/?url=${url}`
 )
   .then(response => response.json())
   .then(result => {
     let reg = /<source src="\/\/([^"]+)/g;
     let match;
     let results = [];

     while (match = reg.exec(result.body)) { // eslint-disable-line
       results.push(match[1])
     }

     const src = results.pop();

     if (src) {
       return "https://" + src
     }
   })
   .catch(error => {
     console.error(error);
   })
 )

 export default fetchErome;