import React from 'react'

function DisplayImage ({
  inputs = {},
}) {
  return (
    <img src={inputs.src} />
  )
}

export default DisplayImage
