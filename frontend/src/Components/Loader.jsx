import React from 'react'
import LoadingGif from '../Assets/Images/Double Ring@1x-1.0s-200px-200px.gif'

const Loader = () => {
  return (
    <div className='loader'>
      <div className="loader_image">
        <img src={LoadingGif} alt=""/>
      </div>
    </div>
  )
}

export default Loader
