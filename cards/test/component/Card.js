import React from 'react'

function Component ({
  inputs = {},
}) {
  return (
    <div className='App'>
      <h1>Result</h1>
      <h1>{inputs.data}</h1>
    </div>
  )
}

export default Component
