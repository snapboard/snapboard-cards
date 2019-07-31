import React from 'react'
import Button from '@snapboard/ui/Button'
import List, { ListItem, ListContent, ListHeader, ListDesc } from '@snapboard/ui/List'
import Image from '@snapboard/ui/Image'
import moment from 'moment'

function Component ({
  data,
}) {
  if (!data) return null
  const el = data.map(({ id, url, title, updated_at, image, stock }) => {
    return (
        <ListItem key={id} as='a' href={url} rel='noopener noreferrer' target='_blank'>
          <ListContent fixed vcenter>
            <Image src={image} />
          </ListContent>
          <ListContent vcenter stlye={{ marginRight: '1em' }}>
            <ListHeader>{title}</ListHeader>
            <ListDesc style={{ padding: '0.5em 0' }}>
              Updated: {moment(updated_at).format('YYYY-MM-DD')}
            </ListDesc>
          </ListContent>
          <ListContent vcenter fixed style={{ color: '#aaa', textAlign: 'center', width: 30, padding: '0.5em', fontSize: '2em' }}>
            {stock}
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
