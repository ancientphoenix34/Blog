import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../Context/UserContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Components/Loader';
import ConfirmationBox from '../Components/ConfirmationBox';

const DeletePost = ({ postId: id }) => {
  const { currentUser } = useContext(UserContext)
  const token = currentUser?.token;
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [])

  const removePost = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/posts/${id}`, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } });
      if (response && response.status === 200) {
        if (location.pathname == `/myposts/${currentUser.id}`) {
          navigate(0)
        } else {
          navigate('/')
        }
      }
      setIsLoading(false);
    }
    catch (err) {
      console.log(err);
    }
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <div>
      <Link className='btn sm danger' onClick={() => setShowConfirm(true)}>Delete</Link>
      {showConfirm && (
        <ConfirmationBox
          message="Are you sure you want to delete this post?"
          confirmLabel="Yes, Delete"
          isDanger={true}
          onConfirm={removePost}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  )
}

export default DeletePost
