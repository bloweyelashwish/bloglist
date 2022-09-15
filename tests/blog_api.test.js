const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blogs')



//initialize the database before every test
beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArr = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArr)
})

const api = supertest(app)

describe('when blogs exist', () => {
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
})

describe('when POSTing', () => {
    test('a valid blog can be added', async () => {
        const newBlog = helper.initialBlogs[0]

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

    test('blog has valid data', async () => {
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

    test('existence of id prop', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body[0].id).toBeDefined()
    })

    test('likes default to 0', async () => {
        await api
            .post('/api/blogs')
            .send(helper.initialBlogs[0])
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        expect(response.body[0].likes).toBe(0);
    })

    test('verify if title and post are missing', async () => {
        const falsyPost = {
            author: 'Who knows',
            likes: 140
        }

        await api
            .post('/api/blogs')
            .send(falsyPost)
            .expect(400)

        const notesAtEnd = await helper.blogsInDb()
        console.log(helper.initialBlogs.length === notesAtEnd.length)
        expect(notesAtEnd).toHaveLength(helper.initialBlogs.length)
    })
})

describe('when modifying existing blogs', () => {
    test('when deleting', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const toDel = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${toDel.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

        const authors = blogsAtEnd.map(b => b.author)
        expect(authors).not.toContain(toDel.author)
    })
})

afterAll(() => {
    mongoose.connection.close()
})