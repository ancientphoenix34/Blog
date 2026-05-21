import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../Assets/Images/blogger.png'
import { FaHamburger } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { UserContext } from '../Context/UserContext';
import ConfirmationBox from './ConfirmationBox';


const Header = () => {

  const [isNavOpen, setIsNavOpen] = useState(window.innerWidth > 800 ? true : false)
  const { currentUser, setCurrentUser } = useContext(UserContext)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const navigate = useNavigate()

  const closeNavHandler = () => {
    if (window.innerWidth < 800) {
      setIsNavOpen(false)
    }
    else {
      setIsNavOpen(true)
    }
  }

  return (
    <div>
      <nav>
        <div className="container nav_container">
          <Link to="/" className="nav_logo">
            <img onClick={closeNavHandler} src={logo} alt="" />
          </Link>
          {currentUser?.id && isNavOpen &&
            <ul className="nav_menu">
              <li><Link to={`/profile/${currentUser?.id}`} onClick={closeNavHandler}>{currentUser?.name}</Link></li>
              <li><Link to="/create" onClick={closeNavHandler}>Create post</Link></li>
              <li><Link to="/authors" onClick={closeNavHandler}>Authors</Link></li>
              <li><button onClick={() => { closeNavHandler(); setShowLogoutConfirm(true) }}>Logout</button></li>
            </ul>}
          {!currentUser?.id && isNavOpen &&
            <ul className="nav_menu">
              <li><Link to="/authors" onClick={closeNavHandler}>Authors</Link></li>
              <li><Link to="/login" onClick={closeNavHandler}>Login</Link></li>
            </ul>}
          <button className="nav_toggle_btn" onClick={() => setIsNavOpen(!isNavOpen)}>
            {
              isNavOpen ? <AiOutlineClose /> : <FaHamburger />
            }
          </button>
        </div>
      </nav>
      {showLogoutConfirm && (
        <ConfirmationBox
          message="Are you sure you want to logout?"
          confirmLabel="Yes, Logout"
          isDanger={false}
          onConfirm={() => { setShowLogoutConfirm(false); setCurrentUser(null); navigate('/login') }}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </div>
  )
}

export default Header
