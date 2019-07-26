import React from 'react'
import Button from '@snapboard/ui/Button'
import List, { ListItem, ListContent, ListHeader, ListDesc } from '@snapboard/ui/List'
import Image from '@snapboard/ui/Image'
import moment from 'moment'

function Component ({
  data,
}) {
  if (!data) return null
  const el = data.map(({ id, permalink, title, lastSeen, count }) => {
    return (
        <ListItem key={id} as='a' href={permalink} rel='noopener noreferrer' target='_blank'>
          <ListContent vcenter stlye={{ marginRight: '1em' }}>
            <ListHeader>{title}</ListHeader>
            <ListDesc style={{ padding: '0.5em 0' }}>
              {moment(lastSeen).format('YYYY-MM-DD')} - {moment(lastSeen).from(moment())}
            </ListDesc>
          </ListContent>
          <ListContent vcenter fixed style={{ color: '#aaa', textAlign: 'center', width: 30, padding: '0.5em', fontSize: '2em' }}>
            {count}
          </ListContent>
        </ListItem>
    )
  })
  return (
    <List celled relaxed selection>
      {el}
    </List>
  )
}

export default Component
