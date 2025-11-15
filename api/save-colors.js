
export default async function handler(req, res) {
  const { order, email, selections } = req.body;

  const resp = await fetch(
    `https://${process.env.SHOPIFY_STORE}/admin/api/${process.env.SHOPIFY_API_VERSION}/orders/${order}.json`,
    { headers: { "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN } }
  );
  const data = await resp.json();

  if (!data.order || data.order.email.toLowerCase() !== email.toLowerCase()) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  // Store colors as order metafields (simple)
  const metafields = selections.map(sel => ({
    key: `color_${sel.line_id}`,
    namespace: "custom",
    type: "single_line_text_field",
    value: sel.color
  }));

  await fetch(
    `https://${process.env.SHOPIFY_STORE}/admin/api/${process.env.SHOPIFY_API_VERSION}/orders/${order}/metafields.json`,
    {
      method: "POST",
      headers: {
        "Content-Type":"application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN
      },
      body: JSON.stringify({ metafields })
    }
  );

  res.json({ success: true });
}
