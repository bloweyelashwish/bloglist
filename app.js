const errorHandler = require("./utils/error_handler")
const blogsRouter = require("./controllers/blogs")
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")
const config = require("./utils/config")
const mongoose = require("mongoose")
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const app = express()

mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("tiny"))
}

app.use("/api/blogs", blogsRouter)
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)

// Unknown endpoint
app.use((_, res) => {
  res.status(404).send({ error: "unknown endpoint" })
})

app.use(errorHandler)

module.exports = app
