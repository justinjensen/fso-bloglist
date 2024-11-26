import { Schema, model } from 'mongoose'

const blogSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String },
  url: { type: String, required: true },
  likes: { type: Number, default: 0 }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
  }
})

const Blog = model('Blog', blogSchema)

export default Blog
