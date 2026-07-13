import Link from "next/link";
import { signOut } from "@/features/auth";
import { FlameIcon, LogOutIcon } from "@/shared/icons";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { Button } from "@/shared/ui/button";

export default function HabitsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-3">
          <Link href="/habits" className="flex items-center gap-2">
            <FlameIcon className="size-6 text-primary" />
            <span className="font-heading text-lg font-semibold">Streek</span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <form action={signOut}>
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="size-9"
                aria-label="Sign out"
              >
                <LogOutIcon className="size-5" />
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
