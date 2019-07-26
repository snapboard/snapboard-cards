import React from 'react'
import BigNumber from '@snapboard/ui/BigNumber'

function Component ({ data }) {
  if (!data) return null
  const datasets = [{ 
    label: `Balance (${data.currency.toUpperCase()})`, 
    data: (data.amount || 0) / 100,
  }]
  return (
    <BigNumber data={{ datasets }} />
  )
}

export default Component
