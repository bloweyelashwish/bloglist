const mongoose = require("mongoose")
const supertest = require("supertest")
const user = require("../models/user")
const data = require("./test_users")
const app = require("../app")

const api = supertest(app)

beforeEach(async () => {
  await user.deleteMany({})
  await user.insertMany(data.initialUsers)
})

describe("the user api returns", () => {
  test("the data in json format", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("the correct number of users", async () => {
    const response = await api.get("/api/users")

    expect(response.body).toHaveLength(3)
  })
})

test("the api can add a user to the database", async () => {
  await api
    .post("/api/users")
    .send(data.validUser)
    .expect(201)
    .expect("Content-Type", /application\/json/)

  const response = await api.get("/api/users")

  expect(response.body).toHaveLength(data.initialUsers.length + 1)
})

describe("a user added to the database", () => {
  test("has the correct data", async () => {
    const postResponse = await api
      .post("/api/users")
      .send(data.validUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    expect(postResponse.body.username).toBe(data.validUser.username)
    expect(postResponse.body.name).toBe(data.validUser.name)
  })

  test("is actually saved to the database", async () => {
    const postResponse = await api
      .post("/api/users")
      .send(data.validUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const id = postResponse.body.id

    const response = await api.get("/api/users")

    expect(response.body).toContainEqual({
      username: data.validUser.username,
      name: data.validUser.name,
      blogs: [],
      id
    })
  })
})

describe("a user with an invalid", () => {
  test("username is not added to the database", async () => {
    await api
      .post("/api/users")
      .send(data.invalidUserShortUsername)
      .expect(400)
      .expect("Content-Type", /application\/json/)
      .expect({ error: "username must be at least 3 characters long" })

    const response = await api.get("/api/users")

    expect(response.body).toHaveLength(data.initialUsers.length)
  })

  test("password is not added to the database", async () => {
    await api
      .post("/api/users")
      .send(data.invalidUserShortPassword)
      .expect(400)
      .expect("Content-Type", /application\/json/)
      .expect({ error: "password must be at least 3 characters long" })

    const response = await api.get("/api/users")

    expect(response.body).toHaveLength(data.initialUsers.length)
  })
})

describe("a user with no", () => {
  test("username is not added to the database", async () => {
    await api
      .post("/api/users")
      .send(data.invalidUserNoUsername)
      .expect(400)
      .expect("Content-Type", /application\/json/)
      .expect({ error: "username must be at least 3 characters long" })

    const response = await api.get("/api/users")

    expect(response.body).toHaveLength(data.initialUsers.length)
  })

  test("password is not added to the database", async () => {
    await api
      .post("/api/users")
      .send(data.invalidUserNoPassword)
      .expect(400)
      .expect("Content-Type", /application\/json/)
      .expect({ error: "password must be at least 3 characters long" })

    const response = await api.get("/api/users")

    expect(response.body).toHaveLength(data.initialUsers.length)
  })
})

test("a user with a duplicate username is not added to the database", async () => {
  await api
    .post("/api/users")
    .send(data.invalidUserDuplicateUsername)
    .expect(400)
    .expect("Content-Type", /application\/json/)
    .expect({ error: "username must be unique" })

  const response = await api.get("/api/users")

  expect(response.body).toHaveLength(data.initialUsers.length)
})

afterAll(() => {
  mongoose.connection.close()
})
