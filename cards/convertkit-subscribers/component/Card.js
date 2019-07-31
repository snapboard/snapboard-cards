import React from 'react'
import BigNumber from '@snapboard/ui/BigNumber'

function Component ({ data }) {
  if (!data) return null
  return (
    <BigNumber number={data.total} label='Subscribers' />
  )
}

export default Component
