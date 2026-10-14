import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <div className="grid-wash min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="display text-5xl text-blue">Not found</h1>
        <p className="mt-3 text-muted">That page is not in the Ryfe catalog.</p>
        <Link href="/" className="mt-6 inline-block text-accent">
          Back to inventory
        </Link>
      </main>
    </div>
  );
}
