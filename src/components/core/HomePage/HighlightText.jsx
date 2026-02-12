import React from 'react'

const HighlightText = ({ text }) => {
  return (
    <span className="bg-gradient-to-b from-richblue-400 via-richblue-200 to-caribbeangreen-200 text-transparent bg-clip-text font-bold">
      {" "}
      {text}
    </span>
  )
}

export default HighlightText
