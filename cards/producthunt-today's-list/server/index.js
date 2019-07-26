import { GraphQLClient } from 'graphql-request'

const TOKEN = process.env.TOKEN
const url = 'https://api.producthunt.com/v2/api/graphql'

const query = `query {
  posts {
		edges{
      node {
        id
        name
        votesCount
        tagline
        url
        thumbnail {
          type
          url
          videoUrl
        }
      }
    }
  }
}`

export default async ({ 
  auths, inputs, previous, time, 
}) => {
  const client = new GraphQLClient(url, { 
    headers: {
      Authorization: `Bearer ${TOKEN}`
    }
  })
  const res = await client.request(query)
  if (!res || !res.posts) return []
  return res.posts.edges.map(({ node }) => node)
}