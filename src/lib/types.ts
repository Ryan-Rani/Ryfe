export type ProductType = "single" | "sealed" | "accessory";
export type ProductStatus = "in_stock" | "reserved" | "sold";

export type TcgSet = {
  id: string;
  slug: string;
  name: string;
  series: string;
  code: string | null;
  release_date: string | null;
  image_url: string | null;
  sort_order: number;
};

export type CatalogProduct = {
  id: string;
  set_id: string | null;
  type: ProductType;
  status: ProductStatus;
  name: string;
  description: string | null;
  image_url: string | null;
  collector_number: string | null;
  rarity: string | null;
  condition: string | null;
  quantity: number;
  asking_price: number;
  created_at: string;
  set_slug: string | null;
  set_name: string | null;
  set_series: string | null;
};

export type AdminProduct = {
  id: string;
  set_id: string | null;
  type: ProductType;
  status: ProductStatus;
  name: string;
  description: string | null;
  image_url: string | null;
  collector_number: string | null;
  rarity: string | null;
  condition: string | null;
  quantity: number;
  cost: number;
  asking_price: number;
  sold_price: number | null;
  date_acquired: string | null;
  date_sold: string | null;
  created_at: string;
  updated_at: string;
  sets: Pick<TcgSet, "id" | "slug" | "name" | "series"> | null;
};

export type ProductInput = {
  set_id: string | null;
  type: ProductType;
  status: ProductStatus;
  name: string;
  description: string | null;
  image_url: string | null;
  collector_number: string | null;
  rarity: string | null;
  condition: string | null;
  quantity: number;
  cost: number;
  asking_price: number;
  sold_price: number | null;
  date_acquired: string | null;
  date_sold: string | null;
};

export type Totals = {
  revenue: number;
  profit: number;
  inventoryCost: number;
  inventoryAsking: number;
  inStockCount: number;
  soldCount: number;
  reservedCount: number;
};
