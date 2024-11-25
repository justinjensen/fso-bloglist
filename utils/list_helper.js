const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return undefined
  return blogs.reduce((max, blog) => (max.likes > blog.likes ? max : blog))
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return undefined

  let authorCounts = {}
  let topAuthor = { author: null, blogs: 0 }

  for (const { author } of blogs) {
    const count = (authorCounts[author] || 0) + 1
    authorCounts[author] = count

    if (count > topAuthor.blogs) {
      topAuthor = { author, blogs: count }
    }
  }

  return topAuthor
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return undefined

  let authorLikes = {}
  let topAuthor = { author: null, likes: 0 }

  for (const { author, likes } of blogs) {
    const likesCount = (authorLikes[author] || 0) + likes
    authorLikes[author] = likesCount

    if (likesCount > topAuthor.likes) {
      topAuthor = { author, likes: likesCount }
    }
  }

  return topAuthor
}

export default {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
