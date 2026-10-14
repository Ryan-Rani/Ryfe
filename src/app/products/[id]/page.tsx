import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { money } from "@/lib/money";
import { getCatalogProduct } from "@/lib/queries";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getCatalogProduct(id);
  if (!product) notFound();

  return (
    <div className="grid-wash min-h-screen">
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-line bg-navy">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image_url} alt={product.name} className="w-full object-cover" />
          ) : (
            <div className="flex aspect-square items-end p-8 text-white/70">
              <span className="display text-6xl">{product.name}</span>
            </div>
          )}
        </div>
        <div className="space-y-5">
          {product.set_slug ? (
            <Link href={`/sets/${product.set_slug}`} className="text-sm uppercase tracking-[0.2em] text-accent">
              {product.set_name}
            </Link>
          ) : (
            <p className="text-sm uppercase tracking-[0.2em] text-accent">Uncategorized</p>
          )}
          <h1 className="display text-5xl text-blue">{product.name}</h1>
          <p className="text-muted">{product.description || "Pokémon TCG inventory item."}</p>
          <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-line bg-card p-5 text-sm">
            <div>
              <dt className="text-muted">Type</dt>
              <dd className="capitalize">{product.type}</dd>
            </div>
            <div>
              <dt className="text-muted">Asking price</dt>
              <dd>{money(product.asking_price)}</dd>
            </div>
            <div>
              <dt className="text-muted">Quantity</dt>
              <dd>{product.quantity}</dd>
            </div>
            <div>
              <dt className="text-muted">Number</dt>
              <dd>{product.collector_number ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted">Rarity</dt>
              <dd>{product.rarity ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted">Condition</dt>
              <dd>{product.condition ?? "—"}</dd>
            </div>
          </dl>
        </div>
      </main>
    </div>
  );
}
