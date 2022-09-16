const logger = require("./logger")

const errorHandler = (error, _, res, next) => {
  logger.error(error.message)

  if (error.name === "MongoServerError" && error.code === 11000) {
    if (error.message.includes("username")) {
      return res.status(400).json({ error: "username must be unique" })
    }
  }
  if (error.name === "ValidationError") {
    if (error.message.includes("username")) {
      return res.status(400).json({ error: "username must be at least 3 characters long" })
    }
    if (error.message.includes("Blog")) {
      return res.status(400).json({ error: "title and url are required" })
    }
  }
  if (error.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" })
  }
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "invalid token" })
  }

  next(error)
}

module.exports = errorHandler
