import Blog from '../models/blog.js'

const initialBlogs = [
  {
    title: 'LessWrong',
    author: 'Eliezer Yudkowsky',
    url: 'https://www.lesswrong.com/',
    likes: 42
  },
  {
    title: 'Zen Habits',
    author: 'https://zenhabits.net/',
    url: 'https://zenhabits.net/',
    likes: 108
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

export default {
  initialBlogs,
  blogsInDb
}
