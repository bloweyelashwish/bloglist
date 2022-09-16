const initialUsers = [
  {
    username: "root",
    name: "Superuser",
    passwordHash: "$2b$10$Ngyc.2MZghDGiqQyW30kFuOLLckorhsXCbtssxqG7YzQcPhqxpUKa"
  },
  {
    username: "tester",
    name: "Test User",
    passwordHash: "$2b$10$KkSdthBdUTthv5ig3dqYM.A2ZB68SspuvyMfCFzbDkpDil77MeX2i"
  },
  {
    username: "tester2",
    name: "Test User 2",
    passwordHash: "$2b$10$sw0s9klUCAH5I0YPNeYIIuMsLX8Osb5CwmMZrGkenBjM4s8UQ6KCC"
  }
]

const validUser = {
  username: "tester3",
  name: "Test User 3",
  password: "test"
}

const invalidUserShortUsername = {
  username: "t",
  name: "Test User 3",
  password: "test"
}

const invalidUserShortPassword = {
  username: "tester3",
  name: "Test User 3",
  password: "tt"
}

const invalidUserNoUsername = {
  name: "Test User 3",
  password: "test"
}

const invalidUserNoPassword = {
  username: "tester3",
  name: "Test User 3"
}

const invalidUserDuplicateUsername = {
  username: "tester",
  name: "Test User 3",
  password: "test"
}

module.exports = {
  invalidUserDuplicateUsername,
  invalidUserShortUsername,
  invalidUserShortPassword,
  invalidUserNoUsername,
  invalidUserNoPassword,
  initialUsers,
  validUser
}
