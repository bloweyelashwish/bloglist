const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const supertest = require("supertest")
const User = require("../models/user")
const app = require("../app")

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash("sekret", 10)

  const user = new User({ username: "root", passwordHash })

  await user.save()
})

describe("when there is initially one user in db", () => {
  test("login succeeds with the correct credentials", async () => {
    const response = await api
      .post("/api/login")
      .send({ username: "root", password: "sekret" })
      .expect(200)
      .expect("Content-Type", /application\/json/)

    expect(response.body.token).toBeDefined()
  })

  test("login fails with the wrong password", async () => {
    const response = await api
      .post("/api/login")
      .send({ username: "root", password: "incorrect" })
      .expect(401)

    expect(response.body.error).toContain("invalid username or password")
  })

  test("login fails with the wrong username", async () => {
    const response = await api
      .post("/api/login")
      .send({ username: "incorrect", password: "sekret" })
      .expect(401)

    expect(response.body.error).toContain("invalid username or password")
  })

  test("login fails with no username", async () => {
    const response = await api
      .post("/api/login")
      .send({ password: "sekret" })
      .expect(401)

    expect(response.body.error).toBe("username or password missing")
  })

  test("login fails with no password", async () => {
    const response = await api
      .post("/api/login")
      .send({ username: "root" })
      .expect(401)

    expect(response.body.error).toBe("username or password missing")
  })
})

afterAll(() => {
  mongoose.connection.close()
})
