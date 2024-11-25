const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return undefined
  return blogs.reduce((max, blog) => (max.likes > blog.likes ? max : blog))
}

export default {
  totalLikes,
  favoriteBlog
}
