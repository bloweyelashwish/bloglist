const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blogs')

const initialBlogs = [
    {
        title: "Some blog title",
        author: "Aaron",
        url: "facebook.com/",
        likes: 60
    },
    {
        title: "Some blog title",
        author: "Jake",
        url: "facebook.com/",
        likes: 2
    },
    {
        title: "Some blog title",
        author: "Melissa",
        url: "facebook.com/",
        likes: 30
    }
]

//initialize the database before every test
beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObj = new Blog(initialBlogs[0])
    await blogObj.save()
    blogObj = new Blog(initialBlogs[1])
    await blogObj.save()
    blogObj = new Blog(initialBlogs[2])
    await blogObj.save()
})

const api = supertest(app)

test('blogs are returned as json', async() => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 100000)

test('there is one blog', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(1)
})

test('the author of the first blog is Mark', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].author).toBe('Mark')
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const authors = response.body.map(b => b.author);

    expect(authors).toContain('Aaron')
})

afterAll(() => {
    mongoose.connection.close()
})