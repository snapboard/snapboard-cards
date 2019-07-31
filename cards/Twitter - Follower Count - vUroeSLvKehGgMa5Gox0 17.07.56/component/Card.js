import React from 'react'
import BigNumber from '@snapboard/ui/BigNumber'

function Component ({
  inputs = {},
  data = {},
  update,
}) {
  const { followers_count, screen_name } = data
  return (
    <BigNumber 
      number={followers_count} 
      label={`@${screen_name}`} 
    />
  )
}

export default Component
