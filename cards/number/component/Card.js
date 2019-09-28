import React from 'react'
import BigNumber from '@snapboard/ui/BigNumber'

function Component ({ inputs }) {
  const { number, label } = inputs
  return (
    <BigNumber number={number} label={label} />
  )
}

export default Component
