const userExtractor = require("../utils/user_extractor")
const blogsRouter = require("express").Router()
const Blog = require("../models/blog")

blogsRouter.get("/", async (_, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 })

  res.json(blogs)
})

blogsRouter.post("/", userExtractor, async (req, res, next) => {
  try {
    const body = new Blog(req.body)

    const user = req.user

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.put("/:id", async (req, res) => {
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    context: "query"
  })

  if (updatedBlog) {
    res.json(updatedBlog)
  } else {
    res.status(404).end()
  }
})

blogsRouter.delete("/:id", userExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (blog.user.toString() === req.user.id) {
      await Blog.findByIdAndRemove(req.params.id)

      res.status(204).end()
    } else {
      res.status(401).json({ error: "unauthorized" })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
