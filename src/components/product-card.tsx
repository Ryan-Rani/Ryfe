import Link from "next/link";
import { money } from "@/lib/money";
import type { CatalogProduct } from "@/lib/types";

const typeLabel = {
  single: "Single",
  sealed: "Sealed",
  accessory: "Accessory",
};

export function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group overflow-hidden rounded-2xl border border-line bg-card transition hover:-translate-y-0.5 hover:border-accent"
    >
      <div className="aspect-[4/3] bg-navy/90">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-end p-4 text-white/70">
            <span className="display text-3xl">{product.name.slice(0, 1)}</span>
          </div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted">
          <span>{typeLabel[product.type]}</span>
          <span>{product.set_name ?? "Uncategorized"}</span>
        </div>
        <h3 className="text-lg font-medium leading-tight group-hover:text-accent">{product.name}</h3>
        <p className="text-sm text-muted">
          {product.collector_number ? `#${product.collector_number}` : product.rarity || "Pokémon TCG"}
        </p>
        <p className="display text-xl">{money(product.asking_price)}</p>
      </div>
    </Link>
  );
}
