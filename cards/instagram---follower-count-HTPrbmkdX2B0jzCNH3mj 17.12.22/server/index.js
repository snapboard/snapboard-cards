import axios from 'axios'

const BASE_URL = `https://www.instagram.com/web/search/topsearch/`

export default async ({ 
  auths, inputs, previous, time, 
}) => {
  const url = `${BASE_URL}?query=${inputs.username}`
  const res = await axios.get(url)
  return res.data.users[0].user
}