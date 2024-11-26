import { Router } from 'express'
import Blog from '../models/blog.js'

const blogsRouter = Router()

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  try {
    const blog = await new Blog(request.body).save()
    response.status(201).json(blog)
  } catch (exception) {
    response.status(400).json({ error: exception.message })
  }
})

export default blogsRouter
