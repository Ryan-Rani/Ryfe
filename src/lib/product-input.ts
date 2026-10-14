import type { ProductInput, ProductStatus, ProductType } from "@/lib/types";

function emptyToNull(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

function numberField(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function formToProduct(formData: FormData): ProductInput {
  const status = (emptyToNull(formData.get("status")) ?? "in_stock") as ProductStatus;
  const soldPrice = emptyToNull(formData.get("sold_price"));
  return {
    set_id: emptyToNull(formData.get("set_id")),
    type: (emptyToNull(formData.get("type")) ?? "single") as ProductType,
    status,
    name: String(formData.get("name") ?? "").trim(),
    description: emptyToNull(formData.get("description")),
    image_url: emptyToNull(formData.get("image_url")),
    collector_number: emptyToNull(formData.get("collector_number")),
    rarity: emptyToNull(formData.get("rarity")),
    condition: emptyToNull(formData.get("condition")),
    quantity: Math.max(0, Math.floor(numberField(formData.get("quantity"), 1))),
    cost: numberField(formData.get("cost")),
    asking_price: numberField(formData.get("asking_price")),
    sold_price: soldPrice == null ? null : Number(soldPrice),
    date_acquired: emptyToNull(formData.get("date_acquired")),
    date_sold: emptyToNull(formData.get("date_sold")),
  };
}
