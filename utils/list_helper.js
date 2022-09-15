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

module.exports = {
    dummy,
    totalLikes
}