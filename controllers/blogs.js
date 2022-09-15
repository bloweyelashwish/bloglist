const blogsRouter = require('express').Router();
const Blog = require('../models/blogs');
const {request} = require("express");

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

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    console.log(request.params.id)
    response.status(204).end()
})

module.exports = blogsRouter;