import Shopify from 'shopify-api-node'
import moment from 'moment'
 
export default async ({ 
  auths, inputs,
}) => {
  const shop = auths.shopify.profile.myshopify_domain.replace('.myshopify.com', '')

  const shopify = new Shopify({
    shopName: shop,
    accessToken: auths.shopify.accessToken,
  })

  return getTotalCount(shopify, inputs)
}

async function getTotalCount (shopify, inputs, counter = 0, after = null) {
    const orders = await shopify.order.list({
      limit: 250,
      status: inputs.status || 'any',
      financial_status: inputs.financial && inputs.financial.toLowerCase(),
      fulfillment_status: inputs.fulfillment && inputs.fulfillment.toLowerCase(),
      created_at_min: getStart(inputs.period),
      fields: 'id,total_price',
      since_id: after,
    })

    orders.forEach((item) => {
      counter += parseFloat(item.total_price)
    })

    if (orders.length === 250) {
        return getTotalCount(shopify, inputs, counter, item.id)
    }

    return counter
}

function getStart (period) {
	const now = moment()
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