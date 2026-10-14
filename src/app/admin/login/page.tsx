import { SiteHeader } from "@/components/site-header";

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="grid-wash min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-md px-5 py-16">
        <h1 className="display text-4xl text-blue">Admin</h1>
        <p className="mt-2 text-sm text-muted">Enter the Ryfe admin password to manage inventory and finances.</p>
        <form action="/api/admin/login" method="post" className="mt-6 space-y-4 rounded-2xl border border-line bg-card p-6">
          <input type="hidden" name="next" value={params.next || "/admin"} />
          <label className="grid gap-1 text-sm">
            Password
            <input type="password" name="password" required className="field" />
          </label>
          {params.error ? <p className="text-sm text-red-500">That password did not match.</p> : null}
          <button type="submit" className="w-full rounded-xl bg-blue py-2 text-sm font-medium text-white">
            Sign in
          </button>
        </form>
      </main>
    </div>
  );
}
