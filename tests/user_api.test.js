import { describe, test, after, beforeEach } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app.js'
import helper from './test_helper.js'
import User from '../models/user.js'

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

describe('user api', () => {
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two users', async () => {
    const response = await api.get('/api/users')

    assert.strictEqual(response.body.length, 2)
  })

  test('unique identifier property of the user is named id', async () => {
    const response = await api.get('/api/users')
    const users = response.body
    assert.strictEqual('id' in users[0], true)
    assert.strictEqual('id' in users[1], true)
    assert.strictEqual('_id' in users[0], false)
    assert.strictEqual('_id' in users[1], false)
  })

  test('passwordHash property is not returned', async () => {
    const response = await api.get('/api/users')
    const users = response.body
    assert.strictEqual('passwordHash' in users[0], false)
    assert.strictEqual('passwordHash' in users[1], false)
  })

  test('a valid user can be added', async () => {
    const newUser = {
      username: 'millie',
      name: 'Mildred the cat',
      password: 'friskies'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/users')

    assert.strictEqual(response.body.length, 3)

    const lastUser = response.body[response.body.length - 1]
    assert.strictEqual(lastUser.username, 'millie')
    assert.strictEqual(lastUser.name, 'Mildred the cat')
  })
})

after(async () => {
  await mongoose.connection.close()
})
