"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <span className="h-9 w-24 rounded-full border border-line" />;
  }

  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="rounded-full border border-line px-3 py-1.5 text-xs font-medium tracking-wide uppercase"
    >
      {dark ? "Light mode" : "Dark mode"}
    </button>
  );
}
