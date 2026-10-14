import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { SearchFilters } from "@/components/search-filters";
import { SetupBanner } from "@/components/setup-banner";
import { SiteHeader } from "@/components/site-header";
import { getCatalog, isConfigured } from "@/lib/queries";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const params = await searchParams;
  const configured = isConfigured();
  const products = configured ? await getCatalog({ q: params.q, type: params.type }) : [];

  return (
    <div className="grid-wash min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl space-y-8 px-5 py-10">
        <section className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Pokémon TCG</p>
          <h1 className="display mt-2 text-5xl text-blue">The Ryfe inventory</h1>
          <p className="mt-3 text-muted">
            Singles, sealed product, and accessories, organized by official Pokémon sets.
          </p>
        </section>
        {!configured ? <SetupBanner /> : null}
        <Suspense>
          <SearchFilters />
        </Suspense>
        {products.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-muted">No public inventory yet. Add products in admin once Supabase is connected.</p>
        )}
      </main>
    </div>
  );
}
