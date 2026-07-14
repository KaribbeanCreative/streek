import Link from "next/link";
import { notFound } from "next/navigation";
import { HabitForm, getHabitWithChecks } from "@/features/habits";
import { ChevronLeftIcon } from "@/shared/icons";

export default async function EditHabitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const habit = await getHabitWithChecks(id);
  if (!habit) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Link
          href={`/habits/${habit.id}`}
          aria-label="Back to habit"
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground"
        >
          <ChevronLeftIcon className="size-5" />
        </Link>
        <h1 className="text-2xl font-bold">Edit habit</h1>
      </div>
      <HabitForm habit={habit} />
    </div>
  );
}
