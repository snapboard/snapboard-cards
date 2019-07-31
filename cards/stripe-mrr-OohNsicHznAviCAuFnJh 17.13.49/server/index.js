import Stripe from 'stripe'

const stripe = Stripe(process.env.STRIPE_KEY)

export default async ({ auths, inputs = {} }) => {
	let total = 0
	let currency = 'usd'
	await stripe.subscriptions.list({ 
		stripe_account: auths.stripe.id,
	}).autoPagingEach((sub) => {
		if (sub.status === "trialing" && !inputs.includeTrials) return
		let subTotal = 0
		if (sub.discount && sub.discount.coupon.amount_off) subTotal -= sub.discount.coupon.amount_off
		const discount = (sub.discount && sub.discount.coupon.percent_off) || 0
		if (sub.items) {
			sub.items.data.forEach((item) => {
	  		subTotal += calculatePlanTotal(item.quantity, item.plan)
				currency = item.plan.currency
			})
		}
		total += Math.max(0, subTotal * (1-(discount/100)))
	})
	return {
		total,
		currency,
	}
}

function calculatePlanTotal (qty, plan) {
	// Basic pricing
	if (plan.amount) return plan.amount * qty

	// Tiered pricing
	let remaining = qty
	let runningTotal = 0
	let lastUpTo = 0
	for (let index = 0; index < plan.tiers.length; index++) {
		const tier = plan.tiers[index]
		const tierQty = tier.up_to ? Math.min(tier.up_to - lastUpTo, remaining) : remaining
		console.log(tierQty, tier.up_to, remaining)
		if (tier.flat_amount) runningTotal += tier.flat_amount
		else runningTotal += tier.amount * tierQty
		lastUpTo = tier.up_to
		remaining -= tierQty
		if (!remaining) return runningTotal
	}
}