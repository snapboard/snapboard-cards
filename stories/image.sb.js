import React from 'react'
import { storiesOf } from '@storybook/react'
import Card from './util/Card'
import Image from '../cards/image/component/Card'
import demoParams from '../cards/image/component/demoParams'
import '../cards/image/component/styles.css'

const { src } = demoParams.inputs

storiesOf('Image', module)
  .add('Demo Params', () => {
    return (
      <Card>
        <Image {...demoParams} />
      </Card>
    )
  })

  .add('Height', () => {
    const params = { inputs: { position: 'height', src } }
    return (
      <Card>
        <Image {...params} />
      </Card>
    )
  })

  .add('Cover', () => {
    const params = { inputs: { position: 'cover', src } }
    return (
      <Card>
        <Image {...params} />
      </Card>
    )
  })
