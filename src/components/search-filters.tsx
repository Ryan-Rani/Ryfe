"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function SearchFilters({ path = "/" }: { path?: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => {
      router.push(`${path}?${next.toString()}`);
    });
  }

  return (
    <form
      className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-4 md:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        update("q", String(form.get("q") ?? ""));
      }}
    >
      <input
        name="q"
        defaultValue={params.get("q") ?? ""}
        placeholder="Search cards, boxes, accessories"
        className="flex-1 rounded-xl border border-line bg-background px-3 py-2 outline-none focus:border-accent"
      />
      <select
        defaultValue={params.get("type") ?? "all"}
        onChange={(event) => update("type", event.target.value === "all" ? "" : event.target.value)}
        className="rounded-xl border border-line bg-background px-3 py-2"
      >
        <option value="all">All types</option>
        <option value="single">Singles</option>
        <option value="sealed">Sealed</option>
        <option value="accessory">Accessories</option>
      </select>
      <button
        type="submit"
        className="rounded-xl bg-blue px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        disabled={pending}
      >
        Search
      </button>
    </form>
  );
}
