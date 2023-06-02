import axios from 'axios';

const url = "http://10.168.3.3:5000/api/posts/";

class PostService {
    // Get Posts
    static getPosts() {
        return new Promise(async(resolve, reject) => {
            try {
                const res = await axios.get(url);
                const data = res.data;
                //console.log(data);
                resolve(
                    data.map(post => ({
                        ...post,
                        createdAt: new Date(post.createdAt)
                    }))
                )
            } catch(err) {
                reject(err);
            }
        });
    }

    // Create Post
    static insertPost(text) {
        return axios.post(url, {
            text
        })
    }

    // Delete Post
    static deletePost(id) {
        return axios.delete(`${url}${id}`);
    }
}

export default PostService;