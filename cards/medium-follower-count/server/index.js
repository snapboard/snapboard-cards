import axios from 'axios'
import get from 'lodash.get'

const JSON_HIJACKING_PREFIX = '])}while(1);</x>';

export default async ({ inputs = {} }) => {
  const res = await axios.request({
    url: `https://medium.com/${inputs.isPublication ? '' : '@'}${inputs.username}?format=json`,
    method: 'GET',
    transformResponse: massageHijackedPreventionResponse,
  }).catch((err) => {
    if (err.response.status === 404) throw new Error('Unable to find username')
    throw err
  })
  if (inputs.isPublication) return get(res.data, 'payload.collection.metadata.followerCount')
  const userId = get(res.data, 'payload.user.userId')
  return get(res.data, `payload.references.SocialStats.${userId}.usersFollowedByCount`, 0)
}

function massageHijackedPreventionResponse (response) {
  return JSON.parse(response.replace(JSON_HIJACKING_PREFIX, ''));
}
