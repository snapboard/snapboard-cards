import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Card from './util/Card'
import Number from '../cards/number/component/Card'
import demoParams from '../cards/number/component/demoParams'
import style from '../cards/number/component/styles.css'

storiesOf(`Number`, module)
  .add('Demo Params', () => {
    return (
      <Card style={style}>
        <Number update={action('update')} {...demoParams} />
      </Card>
    )
  })