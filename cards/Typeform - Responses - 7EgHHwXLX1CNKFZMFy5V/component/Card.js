import React from 'react'
import BigNumber from '@snapboard/ui/BigNumber'

function Component ({ data }) {
  if (!data) return null
  
  return (
    <BigNumber data={{ 
      datasets: [{ 
        label: 'Responses', 
        data: data
      }] 
    }} />
  )
}

export default Component
