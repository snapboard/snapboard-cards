import React from 'react'
import Doughnut from '@snapboard/ui/Doughnut'

const labelMap = {
  referral: 'Referral',
  '(none)': 'Direct',
  organic: 'Search',
  '(not set)': 'Not Set'
}

function Component ({ data }) {
  if (!data) return null
  const labels = data.map(({ label }) => labelMap[label] || label)
  const values = data.map(({ value }) => value)
  const chartData = {
    datasets: [{ label: 'Browsers', data: values }],
    labels,
  }
  return (
    <Doughnut data={chartData} />
  )
}

export default Component
