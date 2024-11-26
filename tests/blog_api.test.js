import { test, after, beforeEach } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app.js'
import helper from './test_helper.js'
import Blog from '../models/blog.js'

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 2)
})

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body
  assert.strictEqual('id' in blogs[0], true)
  assert.strictEqual('id' in blogs[1], true)
  assert.strictEqual('_id' in blogs[0], false)
  assert.strictEqual('_id' in blogs[1], false)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'How to Train Your Cat to Do Taxes',
    author: 'Furman Meowthews',
    url: 'http://cataccountant.com',
    likes: 9
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

  const lastBlog = response.body[response.body.length - 1]
  assert.strictEqual(lastBlog.title, 'How to Train Your Cat to Do Taxes')
  assert.strictEqual(lastBlog.author, 'Furman Meowthews')
  assert.strictEqual(lastBlog.url, 'http://cataccountant.com')
  assert.strictEqual(lastBlog.likes, 9)
})

test('missing likes property defaults to zero', async () => {
  const newBlog = {
    title: '10 Reasons You Should Fear Squirrels',
    author: 'Acorn McNutty',
    url: 'http://squirrelwatch.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const lastBlog = response.body[response.body.length - 1]
  assert.strictEqual(lastBlog.title, '10 Reasons You Should Fear Squirrels')
  assert.strictEqual(lastBlog.author, 'Acorn McNutty')
  assert.strictEqual(lastBlog.url, 'http://squirrelwatch.com')
  assert.strictEqual(lastBlog.likes, 0)
})

test('missing title and url properties results in a 400 Bad Request', async () => {
  const newBlog = {
    author: 'Gary Busey',
    likes: 1
  }

  await api.post('/api/blogs').send(newBlog).expect(400)
})

test('delete a blog that exists', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

  const titles = blogsAtEnd.map((blog) => blog.title)
  assert(!titles.includes(blogToDelete.title))
})

test('deleting a blog that does not exist results in a 404 Not Found', async () => {
  const id = new mongoose.Types.ObjectId()
  await api.delete(`/api/blogs/${id}`).expect(404)
})

test('update a blog that exists', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  const updatedBlog = {
    title: 'Why you should never trust a cat',
    author: 'TotallyNotADog',
    url: 'http://pawspace.com',
    likes: 4
  }

  await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(200)
  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlogInDb = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id)
  assert.strictEqual(updatedBlogInDb.title, 'Why you should never trust a cat')
  assert.strictEqual(updatedBlogInDb.author, 'TotallyNotADog')
  assert.strictEqual(updatedBlogInDb.url, 'http://pawspace.com')
  assert.strictEqual(updatedBlogInDb.likes, 4)
})

test('updating a blog that does not exist results in a 404 Not Found', async () => {
  const id = new mongoose.Types.ObjectId()
  const updatedBlog = {
    title: 'Why you should never trust a cat',
    author: 'TotallyNotADog',
    url: 'http://pawspace.com',
    likes: 4
  }
  await api.put(`/api/blogs/${id}`).send(updatedBlog).expect(404)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

  const titles = blogsAtEnd.map((blog) => blog.title)
  assert(!titles.includes('Why you should never trust a cat'))
})

after(async () => {
  await mongoose.connection.close()
})
