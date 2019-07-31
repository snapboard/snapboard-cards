import React from 'react'
import BigNumber from '@snapboard/ui/BigNumber'

function Component ({ data }) {
  const datasets = [{ label: "Customers", data }]
  return (
    <BigNumber data={{ datasets }} />
  )
}

export default Component
