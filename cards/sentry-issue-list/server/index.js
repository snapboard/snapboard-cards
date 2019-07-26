import axios from 'axios'

const BASE_URL = 'https://sentry.io/api/0'

export default async ({ 
  auths, inputs = {}, previous, time, 
}) => {
  const res = await axios.get(`${BASE_URL}/projects/${inputs.project}/issues/`, {
    headers: { Authorization: `Bearer ${auths.sentry.token}` }
  })
  return res.data && res.data.map(({ id, permalink, title, lastSeen, count }) => ({ 
    id, permalink, title, lastSeen, count,
  }))
}