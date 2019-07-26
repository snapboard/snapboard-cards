import React from 'react'
import Bar from '@snapboard/ui/Bar'

function Component ({ data }) {
  if (!data) return null
  
  return (
    <Bar data={data} />
  )
}

export default Component
