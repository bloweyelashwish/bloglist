const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blogs')



//initialize the database before every test
beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObj = new Blog(helper.initialBlogs[0])
    await blogObj.save()
    blogObj = new Blog(helper.initialBlogs[1])
    await blogObj.save()
    blogObj = new Blog(helper.initialBlogs[2])
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

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const authors = response.body.map(b => b.author);

    expect(authors).toContain('Aaron')
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: "Angel",
        author: "Jaron",
        url: "jb.forever/",
        likes: 100000000
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const authors = blogsAtEnd.map(b => b.author)
    expect(authors).toContain('Jaron')
})

test('blog without author is not added', async () => {
    const newBlog = {
        title: "Wont work"
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

afterAll(() => {
    mongoose.connection.close()
})