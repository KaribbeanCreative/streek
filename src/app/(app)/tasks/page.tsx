import {
  QuickAddTask,
  TaskSectionList,
  getTaskSections,
} from "@/features/tasks";

export default async function TasksPage() {
  const sections = await getTaskSections();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">To-Do</h1>
      <QuickAddTask />
      <TaskSectionList sections={sections} />
    </div>
  );
}
