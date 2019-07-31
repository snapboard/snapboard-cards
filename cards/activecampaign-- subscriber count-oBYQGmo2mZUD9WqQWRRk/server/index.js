import axios from 'axios'
import get from 'lodash.get'

export default async ({ auths, inputs = {} }) => {
  const { token, account } = auths.activecampaign
  const res = await axios.request({
    url: '/contacts?limit=1',
    method: 'GET',
    baseURL: `https://${account}.api-us1.com/api/3`,
    headers: {
      "Api-Token": token,
    }
  })
  return res.data.meta.total
}