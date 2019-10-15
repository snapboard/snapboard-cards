import React from 'react'
import Image from '@snapboard/ui/Image'
import List, { ListItem, ListContent, ListHeader, ListDesc } from '@snapboard/ui/List'

function Component ({ inputs }) {
  const { list, compact } = inputs
  if (!list) return null
  const el = list.map(({ title, desc, link, image, count }, i) => {
    const linkProps = link
      ? { href: link, rel: 'noopener noreferrer', target: '_blank' }
      : { style: { cursor: 'default' } }
    return (
      <ListItem key={i} as='a' {...linkProps}>
        {image && (
          <ListContent fixed vcenter>
            <Image src={image} style={{ width: '4em' }} />
          </ListContent>
        )}
        <ListContent vcenter stlye={{ marginRight: '1em' }}>
          <ListHeader>{title}</ListHeader>
          {desc && (
            <ListDesc style={{ padding: '0.5em 0' }}>
              {desc}
            </ListDesc>
          )}
        </ListContent>
        {count && (
          <ListContent
            vcenter
            fixed
            style={{ color: '#aaa', textAlign: 'center', width: 30, padding: '0 0.5em', fontSize: '2em' }}
          >
            {count}
          </ListContent>
        )}
      </ListItem>
    )
  })
  return (
    <List celled relaxed={!compact} selection>
      {el}
    </List>
  )
}

export default Component
