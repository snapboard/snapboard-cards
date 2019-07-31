import React from 'react'
import Line from '@snapboard/ui/Line'
import moment from 'moment'

function Component ({ data, inputs={} }) {
  if (!data) return null
  if (!data.length) return <div className='nodata'>No data received</div>
  const labels = data.map(({ date }) => moment(date).format('YYYY-MM-DD'))
  const values = data.map(({ value }) => value)
  const chartData = {
    datasets: [{ 
      label: inputs.metric || 'Users', 
      data: values
    }],
    labels,
  }
  return (
    <Line data={chartData} />
  )
}

export default Component
