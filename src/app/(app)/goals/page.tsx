import { FlagIcon } from "@/shared/icons";

export default function GoalsPage() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
      <FlagIcon className="size-8 text-muted-foreground" />
      <p className="font-medium">Goals are coming soon</p>
      <p className="text-sm text-muted-foreground">
        Set goals with deadlines and track your progress.
      </p>
    </div>
  );
}
