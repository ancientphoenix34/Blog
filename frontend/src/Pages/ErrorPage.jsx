import React from 'react'
import { Link } from 'react-router-dom'

const ErrorPage = () => {
  return (
    <div>
      <section className='error_page'>
<div className="center">
  <Link to="/" className='btn primary'>GO Back Home</Link>
  <h2>Page not found</h2>
</div>
      </section>
    </div>
  )
}

export default ErrorPage
