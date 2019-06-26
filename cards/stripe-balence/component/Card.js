import React from 'react'

function Component ({ inputs = {} }) {
  return (
    <div className="App">
      <h1>Hello 👋</h1>
      <h2>{ inputs.test }</h2>
    </div>
  )
}

export default Component
