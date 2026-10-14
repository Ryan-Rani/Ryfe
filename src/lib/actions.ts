"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { formToProduct } from "@/lib/product-input";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ProductType, ProductStatus } from "@/lib/types";

async function requireAdmin() {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const product = formToProduct(formData);
  if (!product.name) throw new Error("Name is required");
  const { error } = await supabase.from("products").insert(product);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const product = formToProduct(formData);
  if (!product.name) throw new Error("Name is required");
  const { error } = await supabase.from("products").update(product).eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/products/${id}`);
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin/products");
}

export async function importCsv(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("Choose a CSV file");
  const text = await file.text();
  const rows = parseCsv(text);
  const { data: sets, error: setError } = await supabase.from("sets").select("id, slug, name");
  if (setError) throw setError;
  const setBySlug = new Map((sets ?? []).map((set) => [set.slug.toLowerCase(), set.id]));
  const setByName = new Map((sets ?? []).map((set) => [set.name.toLowerCase(), set.id]));

  const products = rows.map((row) => {
    const setKey = (row.set_slug || row.set || "").toLowerCase();
    return {
      set_id: setBySlug.get(setKey) ?? setByName.get(setKey) ?? null,
      type: (row.type || "single") as ProductType,
      status: (row.status || "in_stock") as ProductStatus,
      name: row.name,
      description: row.description || null,
      image_url: row.image_url || null,
      collector_number: row.collector_number || null,
      rarity: row.rarity || null,
      condition: row.condition || null,
      quantity: Number(row.quantity || 1),
      cost: Number(row.cost || 0),
      asking_price: Number(row.asking_price || 0),
      sold_price: row.sold_price ? Number(row.sold_price) : null,
      date_acquired: row.date_acquired || null,
      date_sold: row.date_sold || null,
    };
  }).filter((row) => row.name);

  if (!products.length) throw new Error("No valid rows found");
  const { error } = await supabase.from("products").insert(products);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin/products");
}

function parseCsv(text: string) {
  const lines = text.replace(/\r/g, "").split("\n").filter((line) => line.trim());
  if (!lines.length) return [];
  const headers = splitCsvLine(lines[0]).map((header) => header.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = (values[index] ?? "").trim();
    });
    return row;
  });
}

function splitCsvLine(line: string) {
  const result: string[] = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
