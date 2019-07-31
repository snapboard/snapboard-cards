import Shopify from 'shopify-api-node'
 
export default async ({ 
  auths, inputs, previous, time, 
}) => {
  const shop = auths.shopify.profile.myshopify_domain.replace('.myshopify.com', '')
  console.log(auths.shopify.profile)

  const shopify = new Shopify({
    shopName: shop,
    accessToken: auths.shopify.accessToken,
  })

  const products = await shopify.product.list({ limit: 10 })

  return products.map(({ 
    id, title, updated_at, url, image, variants
  }) => ({
    id,
    title,
    updated_at,
    url: `https://${shop}.myshopify.com/admin/products/${id}`, 
    image: image.src,
    stock: variants[0].inventory_quantity
  }))
}