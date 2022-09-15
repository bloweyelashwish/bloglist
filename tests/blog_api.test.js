const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const {mongo} = require("mongoose");

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

afterAll(() => {
    mongoose.connection.close()
})