const _ = require("lodash")

const dummy = (blogs) => {
  blogs
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const favorite = blogs.reduce((favorite, blog) =>
    blog.likes > favorite.likes ? blog : favorite,
  { likes: 0 }
  )

  return _.pick(favorite, ["title", "author", "likes"])
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authors = _.countBy(blogs, "author")
  const author = _.maxBy(_.keys(authors), (a) => authors[a])

  return {
    author,
    blogs: authors[author]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const authors = _.groupBy(blogs, "author")
  const author = _.maxBy(_.keys(authors), (a) => totalLikes(authors[a]))

  return {
    author,
    likes: totalLikes(authors[author])
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
