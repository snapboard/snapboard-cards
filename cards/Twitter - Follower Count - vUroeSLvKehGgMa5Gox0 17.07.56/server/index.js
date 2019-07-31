import axios from 'axios'

const BASE_URL = `https://cdn.syndication.twimg.com/widgets/followbutton/info.json`

export default async ({ 
  auths, inputs, previous, time, 
}) => {
  const url = `${BASE_URL}?screen_names=${inputs.username}`
  const res = await axios.get(url)
  return res.data[0]
}