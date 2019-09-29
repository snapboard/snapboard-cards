import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Card from './util/Card'
import Grid from '../cards/grid/component/Card'
import demoParams from '../cards/grid/component/demoParams'
import style from '../cards/grid/component/styles.css'

const State = ({ children, delay }) => {
  const [data, setData] = useState()
  const [metadata, setMetadata] = useState()
  const [loading, setLoading] = useState()
  return children(data, metadata, (data, metadata) => {
    if (!delay) {
      setData(data)
      setMetadata(metadata)
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setData(data)
      setMetadata(metadata)
    }, delay)
  }, loading)
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
        {(data, metadata, set) => (
          <Card style={style}>
            <Grid set={set} data={data} metadata={metadata} />
          </Card>
        )}
      </State>
    )
  })

  .add('With Delay', () => {
    return (
      <State delay={2000}>
        {(data, metadata, set, loading) => (
          <>
            <div>
              {loading ? 'Loading...' : 'Done'}
            </div>
            <Card style={style}>
              <Grid set={set} data={data} metadata={metadata} />
            </Card>
          </>
        )}
      </State>
    )
  })
