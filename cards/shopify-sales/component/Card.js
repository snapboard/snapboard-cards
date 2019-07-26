import React from 'react'
import BigNumber from '@snapboard/ui/BigNumber'

function Component ({ data, inputs = {} }) {
  if (data === null) return null
  return (
    <BigNumber 
      number={data} 
      label={`Total Sales - ${inputs.period || 'Today'}`} />
  )
}

export default Component
