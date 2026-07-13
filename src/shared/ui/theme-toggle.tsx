"use client";

import { useTheme } from "next-themes";
import { Button } from "@/shared/ui/button";
import { MoonIcon, SunIcon } from "@/shared/icons";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-9"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <SunIcon className="hidden size-5 dark:block" />
      <MoonIcon className="size-5 dark:hidden" />
    </Button>
  );
}
