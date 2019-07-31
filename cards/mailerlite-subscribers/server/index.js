import axios from 'axios'
import dayjs from 'dayjs'

export default async ({ auths }) => {
	const subs = await getNext(auths)
	let today = 0
	let last7 = 0
	let last28 = 0
	subs.forEach((sub) => {
		const created = dayjs(sub.date_created || sub.date_subscribe)
		if (created.isAfter(dayjs().startOf('day'))) today += 1
		if (created.isAfter(dayjs().startOf('day').subtract(7, 'day'))) last7 += 1
		if (created.isAfter(dayjs().startOf('day').subtract(28, 'day'))) last28 += 1
	})
	return {
		total: subs.length,
		today,
		last7,
		last28,
	}
}

async function getNext (auths, offset = 0) {
	const res = await axios.get('https://api.mailerlite.com/api/v2/subscribers', {
		headers: {
			'X-MailerLite-ApiKey': auths.mailerlite.token,
		},
		params: {
			limit: 100,
			offset,
		}
	})
	if (res.data.length === 100) {
		const next = await getNext(auths, offset + 100)
		return res.data.concat(next)
	}
	return res.data || []
}