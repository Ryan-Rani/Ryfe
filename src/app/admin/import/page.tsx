import { importCsv } from "@/lib/actions";
import { SiteHeader } from "@/components/site-header";

export default function ImportPage() {
  return (
    <div className="grid-wash min-h-screen">
      <SiteHeader admin />
      <main className="mx-auto max-w-3xl space-y-6 px-5 py-10">
        <h1 className="display text-4xl text-blue">CSV import</h1>
        <p className="text-sm text-muted">
          Headers: name, set or set_slug, type, status, collector_number, rarity, condition, quantity, cost,
          asking_price, sold_price, date_acquired, date_sold, image_url, description.
        </p>
        <form action={importCsv} className="space-y-4 rounded-2xl border border-line bg-card p-6">
          <input type="file" name="file" accept=".csv,text/csv" required className="field w-full" />
          <button type="submit" className="rounded-xl bg-blue px-4 py-2 text-sm text-white">
            Import products
          </button>
        </form>
      </main>
    </div>
  );
}
