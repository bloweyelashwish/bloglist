const Blog = require('../models/blogs')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "Some blog",
        author: "Mark",
        url: "youtube.com",
    },
    {
        title: "Some blog title",
        author: "Aaron",
        url: "facebook.com/"
    },
    {
        title: "Some blog title",
        author: "Jake",
        url: "facebook.com/",
        likes: 2,
    },
    {
        title: "Some blog title",
        author: "Melissa",
        url: "facebook.com/",
        likes: 30,
    }
]

const nonExistingId = async () => {
    const blog = new Blog({
        title:"Dont know",
        author: 'whoknows',
        url: 'youtube.com',
    })

    await blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(b => b.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb,
    usersInDb
}