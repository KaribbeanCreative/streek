import { SquareCheckIcon } from "@/shared/icons";

export default function TasksPage() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
      <SquareCheckIcon className="size-8 text-muted-foreground" />
      <p className="font-medium">To-Do is coming soon</p>
      <p className="text-sm text-muted-foreground">
        Capture one-off tasks and knock them out.
      </p>
    </div>
  );
}
