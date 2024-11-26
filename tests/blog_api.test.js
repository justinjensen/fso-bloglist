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

test('uniique identifier property of the blog posts is named id', async () => {
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

after(async () => {
  await mongoose.connection.close()
})
