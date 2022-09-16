const jwt = require("jsonwebtoken")
const User = require("../models/user")
const config = require("../utils/config")

const userExtractor = async (req, res, next) => {
  const authorization = req.get("authorization")

  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    const token = authorization.substring(7)

    try {
      const decodedToken = jwt.verify(token, config.SECRET)

      if (!token || !decodedToken.id) {
        return res.status(401).json({ error: "token missing or invalid" })
      }

      const user = await User.findById(decodedToken.id)

      if (!user) {
        return res.status(401).json({ error: "token missing or invalid" })
      }

      req.user = user
    } catch (_) {
      return res.status(401).json({ error: "token missing or invalid" })
    }
  } else {
    res.status(401).json({ error: "token missing" })
  }

  next()
}

module.exports = userExtractor
