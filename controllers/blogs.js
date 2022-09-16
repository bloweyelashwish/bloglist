const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
    const authorization = request.get('authorization')

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const user = await User.findById(body.userId)
    const { title, author, url, likes } = body;
    if (!title || !url ) {
        response.status(400).end();
    }

    const blog = new Blog({
        title,
        author,
        url,
        likes,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(body)
})

blogsRouter.put('/:id', async(request, response) => {
    const updBlog = await Blog.findByIdAndUpdate(request.params.id, request.body,
        {
            new: true,
            runValidators: true,
            context: 'query'
        })

    if (updBlog) {
        response.json(updBlog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    console.log(request.params.id)
    response.status(204).end()
})

module.exports = blogsRouter;