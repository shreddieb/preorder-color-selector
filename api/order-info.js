
export default async function handler(req, res) {
  const { order, email } = req.query;

  const resp = await fetch(
    `https://${process.env.SHOPIFY_STORE}/admin/api/${process.env.SHOPIFY_API_VERSION}/orders/${order}.json`,
    { headers: { "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN } }
  );
  const data = await resp.json();

  if (!data.order || data.order.email.toLowerCase() !== email.toLowerCase()) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const items = data.order.line_items.filter(li =>
    (li.fulfillment_status === null) || (li.properties || []).some(p => p.name === "_preorder")
  );

  res.json({ items });
}
