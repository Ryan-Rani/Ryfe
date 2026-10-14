import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { money, profitFor } from "@/lib/money";
import { getAdminProducts } from "@/lib/queries";

export default async function AdminProducts() {
  const products = await getAdminProducts();

  return (
    <div className="grid-wash min-h-screen">
      <SiteHeader admin />
      <main className="mx-auto max-w-6xl space-y-6 px-5 py-10">
        <div className="flex items-end justify-between">
          <h1 className="display text-4xl text-blue">Products</h1>
          <Link href="/admin/products/new" className="rounded-xl bg-blue px-4 py-2 text-sm text-white">
            Add product
          </Link>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-line bg-card">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Set</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Qty</th>
                <th className="px-4 py-3 font-medium">Cost</th>
                <th className="px-4 py-3 font-medium">Asking</th>
                <th className="px-4 py-3 font-medium">Sold</th>
                <th className="px-4 py-3 font-medium">Profit</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-line">
                  <td className="px-4 py-3">
                    <Link href={`/admin/products/${product.id}`} className="hover:text-accent">
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{product.sets?.name ?? "—"}</td>
                  <td className="px-4 py-3 capitalize">{product.type}</td>
                  <td className="px-4 py-3">{product.status.replace("_", " ")}</td>
                  <td className="px-4 py-3">{product.quantity}</td>
                  <td className="px-4 py-3">{money(product.cost)}</td>
                  <td className="px-4 py-3">{money(product.asking_price)}</td>
                  <td className="px-4 py-3">{product.sold_price == null ? "—" : money(product.sold_price)}</td>
                  <td className="px-4 py-3">{product.status === "sold" ? money(profitFor(product)) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
