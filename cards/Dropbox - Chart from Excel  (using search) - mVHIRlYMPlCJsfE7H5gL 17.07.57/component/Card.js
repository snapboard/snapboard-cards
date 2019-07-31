import React from 'react'
import Chart from '@snapboard/ui/Chart'

function Component ({ data, inputs={} }) {
  if (!data) return null
  
  return (
    <Chart data={data} type={inputs.type} />
  )
}

export default Component
