import Stripe from 'stripe'

const stripe = Stripe(process.env.STRIPE_KEY)

export default async ({ auths }) => {
  let total = 0
	await stripe.customers.list({ 
		limit: 100,
		stripe_account: auths.stripe.id,
	}).autoPagingEach((customer) => {
	  total += 1
	})
	return total
}