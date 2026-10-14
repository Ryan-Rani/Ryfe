import { notFound } from "next/navigation";
import { ProductForm } from "@/components/product-form";
import { SiteHeader } from "@/components/site-header";
import { getAdminProduct, getSets } from "@/lib/queries";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, sets] = await Promise.all([getAdminProduct(id), getSets()]);
  if (!product) notFound();

  return (
    <div className="grid-wash min-h-screen">
      <SiteHeader admin />
      <main className="mx-auto max-w-4xl space-y-6 px-5 py-10">
        <h1 className="display text-4xl text-blue">Edit {product.name}</h1>
        <ProductForm sets={sets} product={product} />
      </main>
    </div>
  );
}
