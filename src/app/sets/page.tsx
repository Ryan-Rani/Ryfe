import Link from "next/link";
import { SetupBanner } from "@/components/setup-banner";
import { SiteHeader } from "@/components/site-header";
import { getSets, isConfigured } from "@/lib/queries";

export default async function SetsPage() {
  const configured = isConfigured();
  const sets = configured ? await getSets() : [];
  const grouped = new Map<string, typeof sets>();
  for (const set of sets) {
    const items = grouped.get(set.series) ?? [];
    items.push(set);
    grouped.set(set.series, items);
  }

  return (
    <div className="grid-wash min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl space-y-8 px-5 py-10">
        <h1 className="display text-5xl text-blue">Sets</h1>
        {!configured ? <SetupBanner /> : null}
        {[...grouped.entries()].map(([series, items]) => (
          <section key={series} className="space-y-3">
            <h2 className="text-sm uppercase tracking-[0.2em] text-muted">{series}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((set) => (
                <Link
                  key={set.id}
                  href={`/sets/${set.slug}`}
                  className="rounded-2xl border border-line bg-card p-5 hover:border-accent"
                >
                  <p className="text-xs uppercase tracking-wide text-muted">{set.code ?? "TCG"}</p>
                  <p className="display mt-2 text-2xl">{set.name}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
