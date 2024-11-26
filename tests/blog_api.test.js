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

after(async () => {
  await mongoose.connection.close()
})
