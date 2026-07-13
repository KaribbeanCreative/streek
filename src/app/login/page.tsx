import { LoginForm } from "@/features/auth";
import { FlameIcon } from "@/shared/icons";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-12">
      <div className="flex items-center gap-2">
        <FlameIcon className="size-7 text-primary" />
        <span className="font-heading text-2xl font-semibold">Streek</span>
      </div>
      <LoginForm linkError={error === "invalid_link"} />
    </div>
  );
}
