import React from 'react'
import Button from '@snapboard/ui/Button'
import List, { ListItem, ListContent, ListHeader, ListDesc } from '@snapboard/ui/List'
import Image from '@snapboard/ui/Image'

function Component ({
  inputs = {},
  data = {},
  update,
}) {
  if (!data) return null
  const el = data.map(({ id, url, name, thumbnail, tagline, votesCount }) => {
    return (
        <ListItem key={id} as='a' href={url} rel='noopener noreferrer' target='_blank'>
          <ListContent fixed vcenter>
            <Image src={thumbnail.url} />
          </ListContent>
          <ListContent vcenter stlye={{ marginRight: '1em' }}>
            <ListHeader>{name}</ListHeader>
            <ListDesc>{tagline}</ListDesc>
          </ListContent>
          <ListContent fixed vcenter>
            <Button size='sm'>{votesCount}</Button>
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
