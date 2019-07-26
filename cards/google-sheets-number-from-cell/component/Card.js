import React from 'react'
import BigNumber from '@snapboard/ui/BigNumber'

function Component ({
  inputs = {},
  data = {},
  update,
}) {
  const { value = 0, label = '' } = data
  return (
    <BigNumber number={value} label={label} />
  )
}

export default Component
