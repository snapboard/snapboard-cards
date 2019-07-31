import React from 'react'
import BigNumber from '@snapboard/ui/BigNumber'

function Component ({ data }) {
  if (!data) return null
  const { total, today, last7, last28 } = data
  const chartData = {
    labels: ['Month', 'Week', 'Today'],
    datasets: [{
      label: 'Customers',
      data: [last28, last7, today, total],
    }],
  }
  return (
    <BigNumber data={chartData} prefix='+' />
  )
}

export default Component
