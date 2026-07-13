import Link from "next/link";
import { FlameIcon } from "@/shared/icons";
import { Button } from "@/shared/ui/button";
import { ThemeToggle } from "@/shared/ui/theme-toggle";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <FlameIcon className="size-6 text-primary" />
          <span className="font-heading text-xl font-semibold">Streek</span>
        </div>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Keep the{" "}
          <span className="bg-gradient-to-r from-flame-from to-flame-to bg-clip-text text-transparent">
            flame
          </span>{" "}
          alive
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Track your habits, tasks and goals. Streek v1 is under construction.
        </p>
        <Button asChild className="mt-2 h-12 px-8">
          <Link href="/habits">Get started</Link>
        </Button>
      </main>
    </div>
  );
}
