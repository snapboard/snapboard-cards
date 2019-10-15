import React from 'react'
import { storiesOf } from '@storybook/react'
import Card from './util/Card'
import Calendar from '../cards/calendar/component/Card'
// import demoParams from '../cards/calendar/component/demoParams'
import style from '../cards/calendar/component/styles.css'

storiesOf('Calendar', module)
  .add('Basic Calendar', () => {
    return (
      <Card style={style}>
        <Calendar />
      </Card>
    )
  })
