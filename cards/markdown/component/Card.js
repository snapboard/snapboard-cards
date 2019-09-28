import React from 'react'
import ReactMarkdown from 'react-markdown'

function Markdown ({ inputs }) {
  return (
    <div className='container'>
      <ReactMarkdown source={inputs.markdown || ''} />
    </div>
  )
}

export default Markdown
