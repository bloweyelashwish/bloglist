require("dotenv").config()

const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || "development"
const MONGODB_URI = NODE_ENV === "test"
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

const SECRET = process.env.SECRET
if (!SECRET) {
  throw new Error("SECRET environment variable not set")
}

module.exports = {
  MONGODB_URI,
  NODE_ENV,
  SECRET,
  PORT
}
