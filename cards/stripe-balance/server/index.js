import Stripe from 'stripe'

const stripe = Stripe(process.env.STRIPE_KEY)

export default async ({ auths }) => {
	const bal = await stripe.balance.retrieve({
		stripe_account: auths.stripe.id
	})
	return bal.available[0]
}