import React from 'react'
import BigNumber from '@snapboard/ui/BigNumber'

function Component ({ data }) {
  if (data === null) return null
  
  return (
    <BigNumber number={data} label='Responses' />
  )
}

export default Component
