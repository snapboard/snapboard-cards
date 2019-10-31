import React from 'react'
import { storiesOf } from '@storybook/react'
import Card from './util/Card'
import Chart from '../cards/chart/component/Card'
import demoParams from '../cards/chart/component/demoParams'
import '../cards/chart/component/styles.css'

const objectData = {
  '2019-01-01': { Food: 10, Beverage: 20 },
  '2019-01-02': { Food: 20, Beverage: 30 },
  '2019-01-03': { Food: 40, Beverage: 50 },
}

storiesOf('Chart', module)
  .add('Demo Params', () => {
    return (
      <Card>
        <Chart {...demoParams} />
      </Card>
    )
  })

  .add('Object Object', () => {
    const params = { inputs: { data: objectData } }
    return (
      <Card>
        <Chart {...params} />
      </Card>
    )
  })

  .add('Object Array', () => {
    const data = {
      '2019-01-01': [10, 20],
      '2019-01-02': [20, 30],
      '2019-01-03': [40, 50],
    }
    const labels = ['Food', 'Beverage']
    const params = { inputs: { data, labels } }
    return (
      <Card>
        <Chart {...params} />
      </Card>
    )
  })

  .add('Object Values', () => {
    const data = {
      '2019-01-01': 10,
      '2019-01-02': 20,
      '2019-01-03': 30,
    }
    const params = { inputs: { data } }
    return (
      <Card>
        <Chart {...params} />
      </Card>
    )
  })

// .add('Array of objects - no labels', () => {
//   const data = [{ name: 10, age: 20 }, { name: 20, age: 5 }]
//   const labels = []
//   const params = { inputs: { data, labels } }
//   return (
//     <Card>
//       <Chart {...params} />
//     </Card>
//   )
// })

  .add('Array - no labels', () => {
    const data = [10, 20]
    const labels = []
    const params = { inputs: { data, labels } }
    return (
      <Card>
        <Chart {...params} />
      </Card>
    )
  })

  .add('Array - with labels', () => {
    const data = [10, 20]
    const labels = ['Food', 'Beverage']
    const params = { inputs: { data, labels } }
    return (
      <Card>
        <Chart {...params} />
      </Card>
    )
  })

  .add('Dates - with Array', () => {
    const data = [10, 20]
    const period = { count: 2, unit: 'day' }
    const params = { inputs: { data, xaxis: 'date', period } }
    return (
      <Card>
        <Chart {...params} />
      </Card>
    )
  })

  .add('Dates - with Object', () => {
    const data = { 1572307200000: 10, 1572220800000: 30 }
    const period = { count: 14, unit: 'day' }
    const params = { inputs: { data, xaxis: 'date', period } }
    return (
      <Card>
        <Chart {...params} />
      </Card>
    )
  })

  .add('Raw Format', () => {
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        label: 'My First dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
      }, {
        label: 'My Second dataset',
        data: [62, 81, 73, 64, 57, 60, 70],
      }],
    }
    const params = { inputs: { data } }
    return (
      <Card>
        <Chart {...params} />
      </Card>
    )
  })

  .add('Object Object - Inverted', () => {
    const params = { inputs: { data: objectData, invert: true } }
    return (
      <Card>
        <Chart {...params} />
      </Card>
    )
  })

  .add('Object Object - Line', () => {
    const data = objectData
    const params = { inputs: { data, type: 'line' } }
    return (
      <Card>
        <Chart {...params} />
      </Card>
    )
  })
