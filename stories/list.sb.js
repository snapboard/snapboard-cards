import React from 'react'
import { storiesOf } from '@storybook/react'
import Card from './util/Card'
import List from '../cards/list/component/Card'
import demoParams from '../cards/list/component/demoParams'
import style from '../cards/list/component/styles.css'

storiesOf('List', module)
  .add('Demo Params', () => {
    return (
      <Card style={style}>
        <List {...demoParams} />
      </Card>
    )
  })

  .add('List with titles only', () => {
    const list = [{ title: 'Hello World' }, { title: 'Goodbye World' }]
    return (
      <Card style={style}>
        <List inputs={{ list }} />
      </Card>
    )
  })

  .add('List with desc', () => {
    const list = [
      { title: 'Hello World', desc: 'This is the first desc' },
      { title: 'Goodbye World', desc: 'I\'m the second desc' },
    ]
    return (
      <Card style={style}>
        <List inputs={{ list }} />
      </Card>
    )
  })

  .add('List with count', () => {
    const list = [
      { title: 'Hello World', count: 10 },
      { title: 'Goodbye World', count: 20 },
    ]
    return (
      <Card style={style}>
        <List inputs={{ list }} />
      </Card>
    )
  })

  .add('List with image', () => {
    const list = [
      {
        title: 'Hello World',
        image: 'https://ichef.bbci.co.uk/news/240/cpsprodpb/15B79/production/_109235988_simples.jpg',
        desc: 'With a desc',
      },
      {
        title: 'Goodbye World',
        image: 'https://ichef.bbci.co.uk/news/240/cpsprodpb/15B79/production/_109235988_simples.jpg',
      },
    ]
    return (
      <Card style={style}>
        <List inputs={{ list }} />
      </Card>
    )
  })

  .add('List with link', () => {
    const list = [
      { title: 'google.com', link: 'https://google.com' },
      { title: 'yahoo.com', link: 'https://yahoo.com' },
    ]
    return (
      <Card style={style}>
        <List inputs={{ list }} />
      </Card>
    )
  })

  .add('Compact List', () => {
    const list = [{ title: 'Hello World' }, { title: 'Goodbye World' }]
    return (
      <Card style={style}>
        <List inputs={{ list, compact: true }} />
      </Card>
    )
  })
