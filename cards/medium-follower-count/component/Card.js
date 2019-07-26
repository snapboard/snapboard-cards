import React from 'react'
import BigNumber from '@snapboard/ui/BigNumber'

function Component ({
  data,
}) {
  return (
    <BigNumber 
      number={data || 0} 
      label={'Followers'} 
    />
  )
}

export default Component
