const listHelper = require("../utils/list_helper")
const data = require("./test_blogs")

const strip = (blog) => {
  return {
    title: blog.title,
    author: blog.author,
    likes: blog.likes
  }
}

test("dummy returns one", () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe("total likes", () => {
  test("of an empty list is zero", () => {
    const blogs = []

    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(0)
  })

  test("of a list with a single blog is the likes of that blog", () => {
    const blogs = [data.blog]

    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(23)
  })

  test("of a larger list is correct", () => {
    const blogs = data.blogs

    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })
})

describe("favorite blog", () => {
  test("of an empty list is null", () => {
    const blogs = []

    const result = listHelper.favoriteBlog(blogs)
    expect(result).toBe(null)
  })

  test("of a list with a single blog is that blog", () => {
    const blogs = [data.blog]

    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual(strip(data.blog))
  })

  test("of a larger list is the blog with the most likes", () => {
    const blogs = data.blogs

    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual(strip(data.blogs[2]))
  })
})

describe("most blogs", () => {
  test("of an empty list is null", () => {
    const blogs = []

    const result = listHelper.mostBlogs(blogs)
    expect(result).toBe(null)
  })

  test("of a list with a single blog is the author of that blog", () => {
    const blogs = [data.blog]

    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({ author: "Olaf", blogs: 1 })
  })

  test("of a larger list is the author with the most blogs", () => {
    const blogs = data.blogs

    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({ author: "Robert C. Martin", blogs: 3 })
  })
})

describe("most likes", () => {
  test("of an empty list is null", () => {
    const blogs = []

    const result = listHelper.mostLikes(blogs)
    expect(result).toBe(null)
  })

  test("of a list with a single blog is the author of that blog", () => {
    const blogs = [data.blog]

    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({ author: "Olaf", likes: 23 })
  })

  test("of a larger list is the author with the most total likes", () => {
    const blogs = data.blogs

    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({ author: "Edsger W. Dijkstra", likes: 17 })
  })
})
