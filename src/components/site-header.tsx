import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader({ admin }: { admin?: boolean }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="display text-2xl tracking-tight text-blue">
          Ryfe
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:text-accent">
            Inventory
          </Link>
          <Link href="/sets" className="hover:text-accent">
            Sets
          </Link>
          {admin ? (
            <>
              <Link href="/admin" className="hover:text-accent">
                Dashboard
              </Link>
              <Link href="/admin/products" className="hover:text-accent">
                Products
              </Link>
              <form action="/api/admin/logout" method="post">
                <button type="submit" className="hover:text-accent">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <Link href="/admin" className="hover:text-accent">
              Admin
            </Link>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
