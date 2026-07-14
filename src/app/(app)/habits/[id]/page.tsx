import Link from "next/link";
import { notFound } from "next/navigation";
import { HabitDetail, getHabitWithChecks } from "@/features/habits";
import { ChevronLeftIcon } from "@/shared/icons";

export default async function HabitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const habit = await getHabitWithChecks(id);
  if (!habit) notFound();

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/habits"
        className="flex w-fit items-center gap-1 text-sm text-muted-foreground"
      >
        <ChevronLeftIcon className="size-4" />
        Habits
      </Link>
      <HabitDetail habit={habit} />
    </div>
  );
}
