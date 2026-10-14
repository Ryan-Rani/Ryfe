import { createProduct, deleteProduct, updateProduct } from "@/lib/actions";
import type { AdminProduct, TcgSet } from "@/lib/types";

export function ProductForm({
  sets,
  product,
}: {
  sets: TcgSet[];
  product?: AdminProduct;
}) {
  const action = product
    ? updateProduct.bind(null, product.id)
    : createProduct;

  return (
    <form action={action} className="grid gap-4 rounded-2xl border border-line bg-card p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          Name
          <input name="name" required defaultValue={product?.name} className="field" />
        </label>
        <label className="grid gap-1 text-sm">
          Set
          <select name="set_id" defaultValue={product?.set_id ?? ""} className="field">
            <option value="">Uncategorized</option>
            {sets.map((set) => (
              <option key={set.id} value={set.id}>
                {set.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Type
          <select name="type" defaultValue={product?.type ?? "single"} className="field">
            <option value="single">Single</option>
            <option value="sealed">Sealed</option>
            <option value="accessory">Accessory</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Status
          <select name="status" defaultValue={product?.status ?? "in_stock"} className="field">
            <option value="in_stock">In stock</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Collector number
          <input name="collector_number" defaultValue={product?.collector_number ?? ""} className="field" />
        </label>
        <label className="grid gap-1 text-sm">
          Rarity
          <input name="rarity" defaultValue={product?.rarity ?? ""} className="field" />
        </label>
        <label className="grid gap-1 text-sm">
          Condition
          <input name="condition" defaultValue={product?.condition ?? ""} placeholder="NM, LP, PSA 10" className="field" />
        </label>
        <label className="grid gap-1 text-sm">
          Quantity
          <input name="quantity" type="number" min="0" defaultValue={product?.quantity ?? 1} className="field" />
        </label>
        <label className="grid gap-1 text-sm">
          Purchase cost
          <input name="cost" type="number" step="0.01" defaultValue={product?.cost ?? 0} className="field" />
        </label>
        <label className="grid gap-1 text-sm">
          Asking price
          <input name="asking_price" type="number" step="0.01" defaultValue={product?.asking_price ?? 0} className="field" />
        </label>
        <label className="grid gap-1 text-sm">
          Sold price
          <input name="sold_price" type="number" step="0.01" defaultValue={product?.sold_price ?? ""} className="field" />
        </label>
        <label className="grid gap-1 text-sm">
          Date acquired
          <input name="date_acquired" type="date" defaultValue={product?.date_acquired ?? ""} className="field" />
        </label>
        <label className="grid gap-1 text-sm">
          Date sold
          <input name="date_sold" type="date" defaultValue={product?.date_sold ?? ""} className="field" />
        </label>
        <label className="grid gap-1 text-sm md:col-span-2">
          Image URL
          <input name="image_url" defaultValue={product?.image_url ?? ""} className="field" />
        </label>
        <label className="grid gap-1 text-sm md:col-span-2">
          Description
          <textarea name="description" rows={4} defaultValue={product?.description ?? ""} className="field" />
        </label>
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" className="rounded-xl bg-blue px-4 py-2 text-sm font-medium text-white">
          {product ? "Save product" : "Add product"}
        </button>
        {product ? (
          <button
            formAction={deleteProduct.bind(null, product.id)}
            className="rounded-xl border border-line px-4 py-2 text-sm"
          >
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}
