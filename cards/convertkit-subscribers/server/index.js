import axios from 'axios'
import dayjs from 'dayjs'

export default async ({ auths }) => {
  const res = await axios.get('https://api.convertkit.com/v3/subscribers', {
		params: {
			api_secret: auths.convertkit.token,
		}
	})
	return {
		total: res.data.total_subscribers
	}
}