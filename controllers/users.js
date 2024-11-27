import { Router } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/user.js'

const usersRouter = Router()

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  try {
    const { username, name, password } = request.body

    if (!username || !password) {
      return response
        .status(400)
        .json({ error: 'username and password are required.' })
    }

    if (username.length < 3) {
      return response
        .status(400)
        .json({ error: 'username must be at least 3 characters long' })
    }

    if (password.length < 3) {
      return response
        .status(400)
        .json({ error: 'password must be at least 3 characters long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
  } catch (exception) {
    response.status(400).json({ error: exception.message })
  }
})

export default usersRouter
