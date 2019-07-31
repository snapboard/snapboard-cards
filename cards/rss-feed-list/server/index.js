import Parser from 'rss-parser'

export default async ({ inputs = {} }) => {
  const { 
    url, method = 'GET', path,  
    titleProp, descProp, linkProp
  } = inputs

  const parser = new Parser({
    customFields: {
      item: [
        ['media:content', 'image'],
        ['media:thumbnail', 'image'],
        ['image', 'image'],
      ]
    }
  })
  const feed = await parser.parseURL(inputs.url);

  return  feed.items.map(({ title, link, contentSnippet, image }) => ({
    title,
    link,
    desc: contentSnippet,
    image,
  }))
}