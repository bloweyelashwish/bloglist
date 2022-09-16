const mongoose = require("mongoose")
const supertest = require("supertest")
const data = require("./test_blogs")
const app = require("../app")
const blog = require("../models/blog")
const User = require("../models/user")
const validUser = require("./test_users").initialUsers[0]

const api = supertest(app)

var user = null
var token = null
const INVALID_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RlciIsImlkIjoiNjMxY2NkM2MxZmQ2YzZkMjRjOGMwYTFkIiwiaWF0IjoxNjYyOTAzNTY3fQ.9aeIYthsYKPwCZgxDsOafgWNvS96T2TXd3Bp8uqmo84"

const getToken = async () => {
  const response = await api
    .post("/api/login")
    .send({ username: validUser.username, password: "sekret" })
    .expect(200)
    .expect("Content-Type", /application\/json/)

  return response.body.token
}

beforeAll(async () => {
  await User.deleteMany({})

  user = await new User(validUser).save()
  token = await getToken()
})

beforeEach(async () => {
  await blog.deleteMany({})

  const initialBlogs = data.blogs.map(b => {
    b.user = user.id
    return b
  })

  await blog.insertMany(initialBlogs)
})


describe("the blog api returns", () => {
  test("the data in json format", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("the correct number of blogs", async () => {
    const response = await api.get("/api/blogs")

    expect(response.body).toHaveLength(data.blogs.length)
  })

  test("blogs that have id instead of _id", async () => {
    const response = await api.get("/api/blogs")

    expect(response.body[0].id).toBeDefined()
  })

  test("error 400 if title and url are missing from a new blog", async () => {
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(data.blogNoTitleOrUrl)
      .expect(400)
  })
})

test("the api can add a blog to the database", async () => {
  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(data.blog)
    .expect(201)
    .expect("Content-Type", /application\/json/)

  const response = await api.get("/api/blogs")

  expect(response.body).toHaveLength(data.blogs.length + 1)
})

describe("a blog added to the database", () => {
  test("has the correct data", async () => {
    const newBlog = data.blog
    newBlog.user = user.id

    const postResponse = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const id = postResponse.body.id

    const response = await api.get("/api/blogs")

    expect(response.body).toContainEqual({
      title: data.blog.title,
      author: data.blog.author,
      url: data.blog.url,
      likes: data.blog.likes,
      user: {
        username: user.username,
        name: user.name,
        id: user.id
      },
      id
    })
  })

  test("has 0 likes if no likes are specified", async () => {
    const newBlog = data.blogNoLikes
    newBlog.user = user.id

    const postResponse = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    expect(postResponse.body.likes).toBe(0)
  })
})

describe("when a blog is deleted", () => {
  test("the number of blogs goes down by one", async () => {
    const id = (await api.get("/api/blogs")).body[0].id

    await api
      .delete(`/api/blogs/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204)

    const response = await api.get("/api/blogs")

    expect(response.body).toHaveLength(data.blogs.length - 1)
  })

  test("a blog with the deleted id doesn't exist anymore", async () => {
    const id = (await api.get("/api/blogs")).body[0].id

    await api
      .delete(`/api/blogs/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204)

    const response = await api.get("/api/blogs")

    expect(response.body).not.toContainEqual(
      expect.objectContaining({
        title: data.blogs[0].title,
        author: data.blogs[0].author,
        url: data.blogs[0].url,
        likes: data.blogs[0].likes,
        id
      })
    )
  })
})

describe("when a blog is updated", () => {
  test("the number of blogs stays the same", async () => {
    const id = (await api.get("/api/blogs")).body[0].id

    await api
      .put(`/api/blogs/${id}`)
      .send(data.blog)
      .expect(200)

    const response = await api.get("/api/blogs")

    expect(response.body).toHaveLength(data.blogs.length)
  })

  test("the number of likes can be updated", async () => {
    const id = (await api.get("/api/blogs")).body[0].id

    await api
      .put(`/api/blogs/${id}`)
      .send({ likes: 100 })
      .expect(200)

    const response = await api.get("/api/blogs")

    expect(response.body[0].likes).toBe(100)
  })

  test("the whole blog can be updated", async () => {
    const id = (await api.get("/api/blogs")).body[0].id

    await api
      .put(`/api/blogs/${id}`)
      .send(data.blog)
      .expect(200)

    const response = await api.get("/api/blogs")

    expect(response.body).toContainEqual(
      expect.objectContaining({
        title: data.blog.title,
        author: data.blog.author,
        url: data.blog.url,
        likes: data.blog.likes,
        id
      })
    )
  })
})

describe("when authorization token is not provided", () => {
  test("adding a blog returns 401", async () => {
    await api
      .post("/api/blogs")
      .send(data.blog)
      .expect(401)
  })

  test("deleting a blog returns 401", async () => {
    const id = (await api.get("/api/blogs")).body[0].id

    await api
      .delete(`/api/blogs/${id}`)
      .expect(401)
  })
})

describe("when authorization token is invalid", () => {
  test("adding a blog returns 401", async () => {
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${INVALID_TOKEN}`)
      .send(data.blog)
      .expect(401)
  })

  test("deleting a blog returns 401", async () => {
    const id = (await api.get("/api/blogs")).body[0].id

    await api
      .delete(`/api/blogs/${id}`)
      .set("Authorization", `Bearer ${INVALID_TOKEN}`)
      .expect(401)
  })
})

describe("when authorization token is malformed", () => {
  test("adding a blog returns 401", async () => {
    await api
      .post("/api/blogs")
      .set("Authorization", "Bearer Malformed")
      .send(data.blog)
      .expect(401)
  })

  test("deleting a blog returns 401", async () => {
    const id = (await api.get("/api/blogs")).body[0].id

    await api
      .delete(`/api/blogs/${id}`)
      .set("Authorization", "Bearer Malformed")
      .expect(401)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
