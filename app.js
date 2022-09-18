const errorHandler = require("./utils/error_handler")
const blogsRouter = require("./controllers/blogs")
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")
const config = require("./utils/config")
const mongoose = require("mongoose")
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const testingRouter = require("./controllers/tests");

const app = express()

mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())

app.use("/api/blogs", blogsRouter)
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)

if (config.NODE_ENV === "test") {
  const testingRouter = require('./controllers/tests')
  app.use("/api/testing", testingRouter)
}

// Unknown endpoint
app.use((_, res) => {
  res.status(404).send({ error: "unknown endpoint" })
})

app.use(errorHandler)

module.exports = app
