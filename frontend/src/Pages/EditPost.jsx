import React, { useState, useContext, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { UserContext } from '../Context/UserContext'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { extractExcerpt } from '../utils/extractExcerpt'
import AiSuggestCard from '../Components/AiSuggestCard'
import TonePanel from '../Components/TonePanel'


const EditPost = () => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [error, setError] = useState('')

  const [aiSuggestion, setAiSuggestion] = useState(null)
  const [showSuggest, setShowSuggest] = useState(false)
  const [aiSuggestLoading, setAiSuggestLoading] = useState(false)
  const [toneResult, setToneResult] = useState(null)
  const [showTone, setShowTone] = useState(false)
  const [toneLoading, setToneLoading] = useState(false)

  const navigate = useNavigate()
  const { id } = useParams()
  const { currentUser } = useContext(UserContext)
  const token = currentUser?.token

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [])

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]

  const POST_CATEGORIES = [
    "Agriculture", "Business", "Education", "Entertiement", "Art", "Investment", "Uncategorized", "Weather"
  ]

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`)
        setTitle(response.data.title)
        setDescription(response.data.description)
        setCategory(response.data.category)
      } catch (err) {
        console.log(err)
      }
    }
    getPost()
  }, [])

  const handleAiSuggest = async () => {
    const excerpt = extractExcerpt(description)
    if (!excerpt) return setError('Write some content first to get AI suggestions.')
    setError('')
    setAiSuggestLoading(true)
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/ai/suggest`,
        { excerpt },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setAiSuggestion(response.data)
      setShowSuggest(true)
    } catch (err) {
      setError('AI suggestion failed. Please try again.')
    }
    setAiSuggestLoading(false)
  }

  const handleAnalyzeTone = async () => {
    const excerpt = extractExcerpt(description)
    if (!excerpt) return setError('Write some content first to analyse tone.')
    setError('')
    setToneLoading(true)
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/ai/analyze-tone`,
        { excerpt },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setToneResult(response.data)
      setShowTone(true)
    } catch (err) {
      setError('Tone analysis failed. Please try again.')
    }
    setToneLoading(false)
  }

  const editPost = async (e) => {
    e.preventDefault()
    const postData = new FormData()
    postData.set('title', title)
    postData.set('category', category)
    postData.set('description', description)
    postData.set('thumbnail', thumbnail)
    try {
      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/posts/${id}`, postData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response && response.status === 200) {
        return navigate('/')
      }
    } catch (error) {
      setError(error.response.data.message)
    }
  }

  return (
    <section className="create-class">
      <div className="container">
        <h2>Edit Post</h2>
        {error && <p className="form_error-message">{error}</p>}
        <form className="form create-post_form" onSubmit={editPost}>

          <div className="ai-title-row">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
            />
            <button
              type="button"
              className="btn sm ai-btn"
              onClick={handleAiSuggest}
              disabled={aiSuggestLoading}
            >
              {aiSuggestLoading ? '...' : '✨ AI'}
            </button>
          </div>

          {showSuggest && aiSuggestion && (
            <AiSuggestCard
              titles={aiSuggestion.titles}
              category={aiSuggestion.category}
              onSelectTitle={(t) => { setTitle(t); setShowSuggest(false) }}
              onSelectCategory={(c) => { setCategory(c); setShowSuggest(false) }}
              onClose={() => setShowSuggest(false)}
            />
          )}

          <select name="category" value={category} onChange={e => setCategory(e.target.value)}>
            {POST_CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
          </select>

          <ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription} />

          <button
            type="button"
            className="btn sm ai-btn"
            onClick={handleAnalyzeTone}
            disabled={toneLoading}
          >
            {toneLoading ? 'Analysing...' : '🎭 Analyse Tone'}
          </button>

          {showTone && toneResult && (
            <TonePanel result={toneResult} onClose={() => setShowTone(false)} />
          )}

          <input type="file" onChange={e => setThumbnail(e.target.files[0])} accept='png,jpg,jpeg' />
          <button type='submit' className='btn primary'>Save Changes</button>
        </form>
      </div>
    </section>
  )
}

export default EditPost
