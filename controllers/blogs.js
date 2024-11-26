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

blogsRouter.put('/:id', async (request, response) => {
  try {
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
    const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
    if (!deletedBlog) {
      return response.status(404).json({ error: 'Blog not found' })
    }
    response.status(204).end()
  } catch (exception) {
    response.status(400).json({ error: exception.message })
  }
})

export default blogsRouter
