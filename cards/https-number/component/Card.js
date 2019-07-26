import React from 'react'
import BigNumber from '@snapboard/ui/BigNumber'

function Component ({
  data = {},
}) {
  const { value, label } = data
  return (
    <BigNumber 
      number={value} 
      label={label} 
    />
  )
}

export default Component
