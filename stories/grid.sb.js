import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Card from './util/Card'
import Grid from '../cards/grid/component/Card'
import demoParams from '../cards/grid/component/demoParams'
import style from '../cards/grid/component/styles.css'

const State = ({ children }) => {
  const [data, setData] = useState()
  return children(data, setData)
}

storiesOf('Grid', module)
  .add('Demo Params', () => {
    return (
      <Card style={style}>
        <Grid set={action('set')} {...demoParams} />
      </Card>
    )
  })

  .add('Controller', () => {
    return (
      <State>
        {(data, setData) => (
          <Card style={style}>
            <Grid set={setData} data={data} />
          </Card>
        )}
      </State>
    )
  })
