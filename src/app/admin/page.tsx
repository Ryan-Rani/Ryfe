import Link from "next/link";
import { SetupBanner } from "@/components/setup-banner";
import { SiteHeader } from "@/components/site-header";
import { money } from "@/lib/money";
import { getAdminProducts, isConfigured, summarize, summarizeBySet } from "@/lib/queries";

export default async function AdminHome() {
  const configured = isConfigured();
  const products = configured ? await getAdminProducts() : [];
  const totals = summarize(products);
  const bySet = summarizeBySet(products);

  return (
    <div className="grid-wash min-h-screen">
      <SiteHeader admin />
      <main className="mx-auto max-w-6xl space-y-8 px-5 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Private</p>
            <h1 className="display text-5xl text-blue">Financials</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/products/new" className="rounded-xl bg-blue px-4 py-2 text-sm text-white">
              Add product
            </Link>
            <Link href="/admin/import" className="rounded-xl border border-line px-4 py-2 text-sm">
              CSV import
            </Link>
          </div>
        </div>
        {!configured ? <SetupBanner /> : null}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Revenue" value={money(totals.revenue)} />
          <Stat label="Profit" value={money(totals.profit)} />
          <Stat label="Inventory cost" value={money(totals.inventoryCost)} />
          <Stat label="Asking value" value={money(totals.inventoryAsking)} />
        </section>
        <section className="grid gap-4 sm:grid-cols-3">
          <Stat label="In stock listings" value={String(totals.inStockCount)} />
          <Stat label="Reserved" value={String(totals.reservedCount)} />
          <Stat label="Sold" value={String(totals.soldCount)} />
        </section>
        <section className="overflow-hidden rounded-2xl border border-line bg-card">
          <div className="border-b border-line px-5 py-3 text-sm uppercase tracking-wide text-muted">By set</div>
          <table className="w-full text-left text-sm">
            <thead className="text-muted">
              <tr>
                <th className="px-5 py-2 font-medium">Set</th>
                <th className="px-5 py-2 font-medium">Listings</th>
                <th className="px-5 py-2 font-medium">Revenue</th>
                <th className="px-5 py-2 font-medium">Profit</th>
                <th className="px-5 py-2 font-medium">Inventory cost</th>
              </tr>
            </thead>
            <tbody>
              {bySet.map((row) => (
                <tr key={row.name} className="border-t border-line">
                  <td className="px-5 py-3">{row.name}</td>
                  <td className="px-5 py-3">{row.count}</td>
                  <td className="px-5 py-3">{money(row.revenue)}</td>
                  <td className="px-5 py-3">{money(row.profit)}</td>
                  <td className="px-5 py-3">{money(row.inventoryCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="display mt-2 text-3xl">{value}</p>
    </div>
  );
}
