import React from 'react'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css';

function Component ({ data, inputs }) {
  const { startDate, endDate, dates } = data || {}
  let min = null
  let max = null
  dates.forEach(({ count }) => {
    if (!min || count < min) min = count
    if (!max || count > max) max = count
  })
  console.log(max)
  return (
    <CalendarHeatmap
      startDate={startDate}
      endDate={endDate}
      values={dates}
      classForValue={(value) => {
        if (!value || !value.count) {
          return 'color-empty';
        }
        return `color-scale-${Math.ceil(value.count/max*4)}`;
      }}

    />
  )
}

export default Component