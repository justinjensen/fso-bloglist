import { Router } from 'express'
import jwt from 'jsonwebtoken'
import Blog from '../models/blog.js'
import User from '../models/user.js'

const blogsRouter = Router()

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1
  })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      ...request.body,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(blog)
  } catch (exception) {
    response.status(400).json({ error: exception.message })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    if (blog.user.toString() !== decodedToken.id) {
      return response.status(403).json({ error: 'Unauthorized' })
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true, runValidators: true }
    )
    response.json(updatedBlog)
  } catch (exception) {
    response.status(400).json({ error: exception.message })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() !== decodedToken.id) {
      return response.status(401).json({ error: 'unauthorized' })
    }

    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    await Blog.findByIdAndDelete(blog.id)

    response.status(204).end()
  } catch (exception) {
    response.status(400).json({ error: exception.message })
  }
})

export default blogsRouter
