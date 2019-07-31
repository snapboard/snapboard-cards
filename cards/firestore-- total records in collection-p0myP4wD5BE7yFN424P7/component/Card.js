import React from 'react'
import BigNumber from '@snapboard/ui/BigNumber'

function Component ({
  inputs = {},
  data,
  update,
}) {
  return (
    <BigNumber number={data || 0} label={inputs.collection} />
  )
}

export default Component
