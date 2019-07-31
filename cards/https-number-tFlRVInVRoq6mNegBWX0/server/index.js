import axios from 'axios'
import get from 'lodash.get'

export default async ({ inputs = {} }) => {
  const { url, method = 'GET', path, labelPath } = inputs
  const res = await axios.request({
    url,
    method,
  })
  return {
    value: path ? get(res.data, path) : res.data,
    label: labelPath ? get(res.data, labelPath) : ''
  }
}