const fetchIReddit = async (post) => {
    return await new Promise((resolve, reject)=>{
        let img = new Image();
        img.addEventListener('load', ()=>{
            if (img.naturalHeight === 60 && img.naturalWidth === 130) reject();
            else resolve(post.url);
        });
        img.addEventListener('error', ()=>{
            reject();
        });
        img.src = post.url;
    });
};

export default fetchIReddit;