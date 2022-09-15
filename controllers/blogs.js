const blogsRouter = require('express').Router();
const Blog = require('../models/blogs');

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const { title, url } = body;

    if (!title || !url ) {
        response.status(400).end();
    }

    response.status(201).json(body)
})

module.exports = blogsRouter;