import React, { useState,useContext } from 'react'
import { Link } from 'react-router-dom'
import logo from '../Assets/Images/blog_6114045.png'
import { FaHamburger } from "react-icons/fa";
import { AiOutlineCloseSquare } from "react-icons/ai";


import { UserContext } from '../Context/UserContext';


const Header = () => {

  const [isNavOpen, setIsNavOpen] = useState(window.innerWidth>800?true:false)
  const  {currentUser}=useContext(UserContext)
  const closeNavHandler=()=>{
    if(window.innerWidth<800){
      setIsNavOpen(false)
    }
    else{
      setIsNavOpen(true)
    }
  }
  return (
    <div>
      <nav>
      <div className="container nav_container">
<Link to="/" className="nav_logo">
<img  onClick={closeNavHandler} src={logo} alt="" />
</Link>
{currentUser?.id &&isNavOpen &&
<ul className="nav_menu">
  <li><Link to="/profile/sdsdf" onClick={closeNavHandler}>{currentUser?.name}</Link></li>
  <li><Link to="/create" onClick={closeNavHandler}>Create post</Link></li>
  <li><Link to="/authors" onClick={closeNavHandler}>Authors</Link></li>
  <li><Link to="/logout" onClick={closeNavHandler}>Logout</Link></li>
</ul>}
{!currentUser?.id &&isNavOpen &&
<ul className="nav_menu">
  <li><Link to="/authors" onClick={closeNavHandler}>Authors</Link></li>
  <li><Link to="/login" onClick={closeNavHandler}>Login</Link></li>
</ul>}
<button className="nav_toggle_btn" onClick={()=>setIsNavOpen(!isNavOpen)}>
  {
    isNavOpen?<AiOutlineCloseSquare />:<FaHamburger />
  }
</button>
      </div>
      </nav>
    </div>
  )
}

export default Header
