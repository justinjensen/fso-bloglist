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

const initialUsers = [
  {
    username: 'doggo',
    name: 'Spot the Dog',
    password: 'woofwoof'
  },
  {
    username: 'socks_the_cat',
    name: 'Socks the Cat',
    password: 'ih8dogs'
  }
]

export default {
  initialBlogs,
  blogsInDb,
  initialUsers
}
