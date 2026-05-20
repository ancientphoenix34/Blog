import React, { useContext, useEffect, useState } from 'react'
import PostAuthor from '../Components/PostAuthor'
import { Link, useParams } from 'react-router-dom'
import { UserContext } from '../Context/UserContext'
import DeletePost from './DeletePost'
import Loader from '../Components/Loader'
import axios from 'axios'
import { extractExcerpt, countWords } from '../utils/extractExcerpt'
import SummaryCard from '../Components/SummaryCard'


const PostDetails = () => {
  const { id } = useParams()

  const [post, setPost] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const [summary, setSummary] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [summaryLoaded, setSummaryLoaded] = useState(false)

  const { currentUser } = useContext(UserContext)

  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`)
        setPost(response.data)
      } catch (error) {
        setError(error)
      }
      setIsLoading(false)
    }
    getPost()
  }, [id])

  const handleSummarize = async () => {
    if (summaryLoaded) {
      setShowSummary(v => !v)
      return
    }

    const excerpt = extractExcerpt(post.description)
    setIsStreaming(true)
    setShowSummary(true)
    setSummary('')

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/ai/summarize`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ excerpt }),
        }
      )

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const text = line.slice(6)
            if (text === '[DONE]' || text === '[ERROR]') break
            setSummary(prev => prev + text)
          }
        }
      }
      setSummaryLoaded(true)
    } catch (err) {
      setSummary('Could not load summary. Please try again.')
    }
    setIsStreaming(false)
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <section className='post-detail'>
      {error && <p className='error'>{String(error)}</p>}
      {post && <div className="container post_detail_container">
        <div className="post-detail_header">
          <PostAuthor authorID={post.creator} createdAt={post.createdAt} />
          {currentUser?.id == post?.creator &&
            <div className="post-detail_buttons">
              <Link to={`/posts/${post?._id}/edit`} className='btn btn-primary' style={{ backgroundColor: "lightblue" }}>Edit</Link>
              <DeletePost postId={id} />
            </div>
          }
        </div>

        <h1>{post.title}</h1>

        {countWords(post.description) > 300 && (
          <button
            type="button"
            className="btn sm ai-btn"
            onClick={handleSummarize}
            disabled={isStreaming}
          >
            {summaryLoaded
              ? (showSummary ? '▲ Hide Summary' : '📄 Show Summary')
              : '📄 Summarize this post'}
          </button>
        )}

        {showSummary && (
          <SummaryCard
            summary={summary}
            isStreaming={isStreaming}
            onClose={() => setShowSummary(false)}
          />
        )}

        <div className="post-detail_thumbnail">
          <img src={post.thumbnail?.startsWith('http') ? post.thumbnail : `${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} alt="" />
        </div>
        <p dangerouslySetInnerHTML={{ __html: post.description }}>
        </p>
      </div>}
    </section>
  )
}

export default PostDetails
