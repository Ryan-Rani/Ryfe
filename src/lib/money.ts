export function money(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function profitFor(product: {
  cost: number | string;
  sold_price: number | string | null;
  status: string;
}) {
  if (product.status !== "sold" || product.sold_price == null) return 0;
  return Number(product.sold_price) - Number(product.cost);
}
