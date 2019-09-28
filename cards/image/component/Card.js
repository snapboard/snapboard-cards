import React from 'react'

function Image ({ inputs }) {
  const style = {}
  const position = inputs.position ? inputs.position.toLowerCase() : 'width'
  if (position === 'width') style.width = '100%'
  else if (position === 'height') style.height = '100%'
  else {
    style.objectFit = position
    style.height = '100%'
    style.width = '100%'
  }
  return (
    <img src={inputs.src} style={style} />
  )
}

export default Image
