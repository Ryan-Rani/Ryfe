import { ProductForm } from "@/components/product-form";
import { SiteHeader } from "@/components/site-header";
import { getSets } from "@/lib/queries";

export default async function NewProductPage() {
  const sets = await getSets();
  return (
    <div className="grid-wash min-h-screen">
      <SiteHeader admin />
      <main className="mx-auto max-w-4xl space-y-6 px-5 py-10">
        <h1 className="display text-4xl text-blue">Add product</h1>
        <ProductForm sets={sets} />
      </main>
    </div>
  );
}
