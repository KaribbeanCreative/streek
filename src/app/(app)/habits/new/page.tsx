import Link from "next/link";
import { HabitForm } from "@/features/habits";
import { ChevronLeftIcon } from "@/shared/icons";

export default function NewHabitPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Link
          href="/habits"
          aria-label="Back to habits"
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground"
        >
          <ChevronLeftIcon className="size-5" />
        </Link>
        <h1 className="text-2xl font-bold">New habit</h1>
      </div>
      <HabitForm />
    </div>
  );
}
