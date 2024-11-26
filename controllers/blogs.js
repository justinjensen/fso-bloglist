import { Router } from 'express'
import Blog from '../models/blog.js'

const blogsRouter = Router()

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = await new Blog(request.body).save()
  response.status(201).json(blog)
})

export default blogsRouter
