import React from 'react'
import BigNumber from '@snapboard/ui/BigNumber'

function Component ({
  inputs = {},
  data,
  update,
}) {
  if (!data) return null
  const { snippet, statistics } = data || {}
  return (
    <BigNumber 
    number={statistics.subscriberCount} 
    label={snippet.title} />
  )
}

export default Component
