import Shopify from 'shopify-api-node'
 
export default async ({ 
  auths, inputs, previous, time, 
}) => {
  const shop = auths.shopify.profile.myshopify_domain.replace('.myshopify.com', '')

  const shopify = new Shopify({
    shopName: shop,
    accessToken: auths.shopify.accessToken,
  })

  const count = await shopify.customer.count()
  return count
}