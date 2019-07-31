import axios from 'axios'
import get from 'lodash.get'

export default async ({ auths, inputs = {} }) => {
  const { token } = auths.convertkit
  const res = await axios.request({
    url: '/subscribers',
    method: 'GET',
    baseURL: `https://api.convertkit.com/v3`,
    params: {
      api_key: token,
    },
    headers: {
      "Api-Token": token,
    }
  })
  return res.data.meta.total
}