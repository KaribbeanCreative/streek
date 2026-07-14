import type { TaskSections } from "../types";
import { TaskItem } from "./task-item";

export function TaskSectionList({ sections }: { sections: TaskSections }) {
  const isEmpty =
    sections.today.length === 0 &&
    sections.upcoming.length === 0 &&
    sections.completed.length === 0;

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center">
        <span className="text-3xl" aria-hidden>
          ✅
        </span>
        <p className="font-medium">No tasks yet</p>
        <p className="text-sm text-muted-foreground">
          Add your first task above, it takes two seconds.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Section title="Today" tasks={sections.today} emptyHint="Nothing due today" />
      <Section title="Upcoming" tasks={sections.upcoming} />
      <Section title="Completed" tasks={sections.completed} />
    </div>
  );
}

function Section({
  title,
  tasks,
  emptyHint,
}: {
  title: string;
  tasks: TaskSections["today"];
  emptyHint?: string;
}) {
  if (tasks.length === 0 && !emptyHint) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="flex items-baseline gap-2 text-sm font-medium text-muted-foreground">
        {title}
        {tasks.length > 0 && (
          <span className="text-xs tabular-nums">{tasks.length}</span>
        )}
      </h2>
      {tasks.length === 0 ? (
        <p className="rounded-xl border border-dashed px-4 py-5 text-center text-sm text-muted-foreground">
          {emptyHint}
        </p>
      ) : (
        tasks.map((task) => <TaskItem key={task.id} task={task} />)
      )}
    </section>
  );
}
