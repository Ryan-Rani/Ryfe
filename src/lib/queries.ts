import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";
import { profitFor } from "@/lib/money";
import type { AdminProduct, CatalogProduct, TcgSet, Totals } from "@/lib/types";

export function isConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export async function getSets(): Promise<TcgSet[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("sets").select("*").order("sort_order");
  if (error) throw error;
  return (data ?? []) as TcgSet[];
}

export async function getSetBySlug(slug: string): Promise<TcgSet | null> {
  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("sets").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return (data as TcgSet) ?? null;
}

export async function getCatalog(options?: {
  setId?: string;
  q?: string;
  type?: string;
}): Promise<CatalogProduct[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  let query = supabase.from("catalog_products").select("*").order("created_at", { ascending: false });
  if (options?.setId) query = query.eq("set_id", options.setId);
  if (options?.type && options.type !== "all") query = query.eq("type", options.type);
  if (options?.q) query = query.ilike("name", `%${options.q}%`);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as CatalogProduct[];
}

export async function getCatalogProduct(id: string): Promise<CatalogProduct | null> {
  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("catalog_products").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as CatalogProduct) ?? null;
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*, sets(id, slug, name, series)")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as AdminProduct[];
}

export async function getAdminProduct(id: string): Promise<AdminProduct | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("products")
    .select("*, sets(id, slug, name, series)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as AdminProduct) ?? null;
}

export function summarize(products: AdminProduct[]): Totals {
  return products.reduce<Totals>(
    (acc, product) => {
      const cost = Number(product.cost);
      const asking = Number(product.asking_price);
      if (product.status === "sold") {
        acc.revenue += Number(product.sold_price ?? 0);
        acc.profit += profitFor(product);
        acc.soldCount += 1;
      } else {
        acc.inventoryCost += cost * Number(product.quantity);
        acc.inventoryAsking += asking * Number(product.quantity);
        if (product.status === "reserved") acc.reservedCount += 1;
        else acc.inStockCount += 1;
      }
      return acc;
    },
    {
      revenue: 0,
      profit: 0,
      inventoryCost: 0,
      inventoryAsking: 0,
      inStockCount: 0,
      soldCount: 0,
      reservedCount: 0,
    },
  );
}

export function summarizeBySet(products: AdminProduct[]) {
  const map = new Map<
    string,
    { name: string; revenue: number; profit: number; inventoryCost: number; count: number }
  >();
  for (const product of products) {
    const key = product.sets?.id ?? "none";
    const current = map.get(key) ?? {
      name: product.sets?.name ?? "Uncategorized",
      revenue: 0,
      profit: 0,
      inventoryCost: 0,
      count: 0,
    };
    current.count += 1;
    if (product.status === "sold") {
      current.revenue += Number(product.sold_price ?? 0);
      current.profit += profitFor(product);
    } else {
      current.inventoryCost += Number(product.cost) * Number(product.quantity);
    }
    map.set(key, current);
  }
  return [...map.values()].sort((a, b) => b.revenue - a.revenue || b.inventoryCost - a.inventoryCost);
}
