import React from 'react'
import Button from '@snapboard/ui/Button'
import List, { ListItem, ListContent, ListHeader, ListDesc } from '@snapboard/ui/List'
import Image from '@snapboard/ui/Image'
import dayjs from 'dayjs'

function Component ({
  data,
}) {
  if (!data) return null
  if (!data.length) {
    return <div className='no-events'>No events today</div>
  }
  const el = data.map(({ id, htmlLink, summary, start, end }) => {
    return (
        <ListItem key={id} as='a' href={htmlLink} rel='noopener noreferrer' target='_blank'>
          <ListContent vcenter stlye={{ marginRight: '1em' }}>
            <ListHeader>{summary}</ListHeader>
            <ListDesc style={{ padding: '0.5em 0' }}>
              {dayjs(start.dateTime || start.date).format('HH.mm')} - {dayjs(end.dateTime || end.date).format('HH.mm')}
            </ListDesc>
          </ListContent>
        </ListItem>
    )
  })
  return (
    <List celled selection>
      {el}
    </List>
  )
}

export default Component
