import React from 'react'
import {Link} from 'react-router-dom'

const Footer = () => {
  return (
    <div>
      <footer>
        <ul className="footer_categories">
          <li><Link to="/posts/categories/Agriculture">Agriculture</Link></li>
          <li><Link to="/posts/categories/Business">Buissness</Link></li>
          <li><Link to="/posts/categories/Education">Education</Link></li>
          <li><Link to="/posts/categories/Entertiement">Entertiement</Link></li>
          <li><Link to="/posts/categories/Art">Art</Link></li>
          <li><Link to="/posts/categories/Investment">Investment</Link></li>
          <li><Link to="/posts/categories/Uncategorized">Uncategorized</Link></li>
          <li><Link to="/posts/categories/Weather">Weather</Link></li>
        </ul>
<hr></hr>
        <div className="footer_copyrigth">
          <small>&copy; 2022 - Blog. All Rights Reserved.</small>
        </div>
      </footer>
    </div>
  )
}

export default Footer
