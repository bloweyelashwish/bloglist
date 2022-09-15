const Blog = require('../models/blogs')

const initialBlogs = [
    {
        title: "Some blog title",
        author: "Aaron",
        url: "facebook.com/",
        likes: 60
    },
    {
        title: "Some blog title",
        author: "Jake",
        url: "facebook.com/",
        likes: 2
    },
    {
        title: "Some blog title",
        author: "Melissa",
        url: "facebook.com/",
        likes: 30
    }
]

const nonExistingId = async () => {
    const blog = new Blog({
        title:"Dont know",
        author: 'whoknows',
        url: 'youtube.com',
        likes: 2
    })

    await blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(b => b.toJSON())
}

module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb
}