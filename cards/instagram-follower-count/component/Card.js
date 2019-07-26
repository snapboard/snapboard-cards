import React from 'react'
import BigNumber from '@snapboard/ui/BigNumber'

function Component ({
  inputs = {},
  data,
  update,
}) {
  const { follower_count, username } = data || {}
  return (
    <BigNumber 
      number={follower_count || 0} 
      label={`@${username}`} 
    />
  )
}

export default Component
