import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../Assets/Images/blog_6114045.png'
import { FaHamburger } from "react-icons/fa";
import { AiOutlineCloseSquare } from "react-icons/ai";

const Header = () => {
  return (
    <div>
      <nav>
      <div className="container nav_container">
<Link to="/" className="nav_logo">
<img src={logo} alt="" />
</Link>
<ul className="nav_menu">
  <li><Link to="/profile">Ernest achiey</Link></li>
  <li><Link to="/create">Create post</Link></li>
  <li><Link to="/authors">Authors</Link></li>
  <li><Link to="/logout">Logout</Link></li>
</ul>
<button className="nav_toggle_btn">
<AiOutlineCloseSquare />
</button>
      </div>
      </nav>
    </div>
  )
}

export default Header
