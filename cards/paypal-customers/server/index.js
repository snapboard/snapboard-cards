import Stripe from 'stripe'
import dayjs from 'dayjs'

const stripe = Stripe(process.env.STRIPE_KEY)

export default async ({ auths }) => {
  let total = 0
	let today = 0
	let last7 = 0
	let last28 = 0
	await stripe.customers.list({ 
		limit: 100,
		stripe_account: auths.stripe.id,
	}).autoPagingEach((customer) => {
		const created = dayjs(customer.created * 1000)
		if (created.isAfter(dayjs().startOf('day'))) today += 1
		if (created.isAfter(dayjs().startOf('day').subtract(7, 'day'))) last7 += 1
		if (created.isAfter(dayjs().startOf('day').subtract(28, 'day'))) last28 += 1
	  total += 1
	})
	return {
		total,
		today,
		last7,
		last28,
	}
}