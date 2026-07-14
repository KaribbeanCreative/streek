import { BottomNav } from "@/shared/ui/bottom-nav";
import {
  FlagIcon,
  FlameIcon,
  HomeIcon,
  SquareCheckIcon,
} from "@/shared/icons";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: <HomeIcon /> },
  { href: "/habits", label: "Habits", icon: <FlameIcon /> },
  { href: "/goals", label: "Goals", icon: <FlagIcon /> },
  { href: "/tasks", label: "To-Do", icon: <SquareCheckIcon /> },
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-28 pt-6">
        {children}
      </main>
      <BottomNav items={NAV_ITEMS} />
    </div>
  );
}
