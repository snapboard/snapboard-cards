import Shopify from 'shopify-api-node'
import moment from 'moment-timezone'
 
export default async ({ 
  auths, inputs,
}) => {
  const shop = auths.shopify.profile.myshopify_domain.replace('.myshopify.com', '')
  const shopify = new Shopify({
    shopName: shop,
    accessToken: auths.shopify.accessToken,
  })

  return getTotalCount(shopify, inputs, auths.shopify.profile || {})
}

async function getTotalCount (shopify, inputs, profile, counter = 0, after = undefined) {
    const orders = await shopify.order.list({
      limit: 250,
      status: formatInput(inputs.status) || 'any',
      financial_status: formatInput(inputs.financial),
      fulfillment_status: formatInput(inputs.fulfillment),
      created_at_min: getStart(inputs.period, profile.iana_timezone),
      fields: 'id,total_price',
      since_id: after,
    })

    orders.forEach((item) => {
      counter += parseFloat(item.total_price)
    })

    if (orders.length === 250) {
        return getTotalCount(shopify, inputs, profile, counter, item.id)
    }

    return counter
}

function getStart (period, tz) {
	const now = moment().tz(tz || 'UTC')
	switch (period) {
		case "Today": return now.startOf('day').format('YYYY-MM-DDTHH:mm:ssZ')
		case "Week": return now.startOf('week').format('YYYY-MM-DDTHH:mm:ssZ')
		case "Month": return now.startOf('month').format('YYYY-MM-DDTHH:mm:ssZ')
    case "Last 7 Days": return now.subtract(7, 'days').startOf('day').format('YYYY-MM-DDTHH:mm:ssZ')
		case "Last 28 Days": return now.subtract(28, 'days').startOf('day').format('YYYY-MM-DDTHH:mm:ssZ')
		case "Last 90 Days": return now.subtract(90, 'days').startOf('day').format('YYYY-MM-DDTHH:mm:ssZ')
    default: return now.startOf('day').format('YYYY-MM-DDTHH:mm:ssZ')
	}
}

function formatInput (input) {
  if (!input) return input
  return input.toLowerCase()
}