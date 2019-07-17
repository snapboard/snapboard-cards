import React from 'react'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css';

function Component ({ data, inputs }) {
  const { startDate, endDate, dates } = data || {}

  return (
    <CalendarHeatmap
      startDate={startDate}
      endDate={endDate}
      values={dates}
      classForValue={(value) => {
        if (!value) {
          return 'color-empty';
        }
        return `color-scale-${Math.min(value.count, 4)}`;
      }}

    />
  )
}

export default Component