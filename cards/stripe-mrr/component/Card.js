import React from 'react'
import BigNumber from '@snapboard/ui/BigNumber'

const currencyMap = {
  usd: '$',
  gbp: '£',
  eur: '€',
  jpy: '¥'
}

function Component ({ data }) {
  if (!data) return null
  return (
    <BigNumber 
      number={data.total === 0 ? 0 : data.total / 100} 
      label={`MRR (${currencyMap[data.currency] || data.currency })`} 
    />
  )
}

export default Component
