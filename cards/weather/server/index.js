import axios from 'axios'
import dayjs from 'dayjs'

const unitMap = {
  Canada: 'ca',
  UK: 'uk2',
  US: 'us',
  Standard: 'si',
}

module.exports = async ({ 
  auths, inputs, previous, time, 
}) => {
  const location = inputs.location.value || inputs.location
  const unit = unitMap[inputs.unit] || 'auto'
  const url = `https://api.darksky.net/forecast/d86cc9057c681d38d7aceb0b5981fd05/${location.lat},${location.lon}?units=${unit}`
  const resp = await axios.get(url)
  const dates = {}
  return resp.data.daily.data
}