import Stripe from 'stripe'

const stripe = Stripe(process.env.STRIPE_KEY)

export default async ({ auths }) => {
	let total = 0
	let currency = 'usd'
	await stripe.subscriptions.list({ 
		stripe_account: auths.stripe.id,
	}).autoPagingEach((sub) => {
		if (!sub.items) return
		sub.items.data.forEach((item) => {
	  	total += item.plan.amount
			currency = item.plan.currency
		})
	})
	return {
		total,
		currency,
	}
}