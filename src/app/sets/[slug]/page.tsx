import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { SearchFilters } from "@/components/search-filters";
import { SiteHeader } from "@/components/site-header";
import { getCatalog, getSetBySlug } from "@/lib/queries";

export default async function SetPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const set = await getSetBySlug(slug);
  if (!set) notFound();
  const products = await getCatalog({ setId: set.id, q: query.q, type: query.type });

  return (
    <div className="grid-wash min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl space-y-8 px-5 py-10">
        <section>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">{set.series}</p>
          <h1 className="display mt-2 text-5xl text-blue">{set.name}</h1>
        </section>
        <Suspense>
          <SearchFilters path={`/sets/${set.slug}`} />
        </Suspense>
        {products.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-muted">Nothing listed in this set yet.</p>
        )}
      </main>
    </div>
  );
}
