export function SetupBanner() {
  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <p className="display text-2xl text-blue">Connect Supabase to load inventory</p>
      <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-muted">
        <li>Create a Supabase project</li>
        <li>Run <code className="text-foreground">supabase/schema.sql</code> in the SQL editor</li>
        <li>Copy <code className="text-foreground">.env.example</code> to <code className="text-foreground">.env.local</code> and add your keys</li>
        <li>Restart the dev server</li>
      </ol>
    </div>
  );
}
