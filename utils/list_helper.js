const _ = require('lodash');

const dummy = (blogs) => {
    return 1
}

const totalLikes = (list) => {
    const likes = list.map(item => item.likes);

    if (likes.length === 0) {
        return 0;
    }

    const total = likes.reduce((acc, curr) => acc + curr, 0);
    return total;
}

const favoriteBlog = (list) => {
    const maxLikedPost = list.reduce((prev, curr) => prev.likes > curr.likes ? prev : curr);
    return maxLikedPost;
}

const mostBlogs = (list) => {
    const max = _.maxBy(list, function(e){
        return e.blogs
    })
    return max
}

const mostLikes = (list) => {
    const max = _.maxBy(list, function(e){
        return e.likes
    })
    return max
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}