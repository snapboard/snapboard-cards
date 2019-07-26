import React from 'react'
import BigNumber from '@snapboard/ui/BigNumber'

function Component ({ data }) {
  if (!data) return null
  
  return (
    <BigNumber 
      label={data.name} 
      number={data.stats.member_count} 
    />
  )
}

export default Component
