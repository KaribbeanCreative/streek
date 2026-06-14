import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protection : pas de session → retour au login.
  if (!user) redirect("/login");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Connecté en tant que <span className="text-foreground">{user.email}</span>
        </p>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Button render={<Link href="/tasks" />}>Mes tâches</Button>
        <LogoutButton />
      </div>
    </main>
  );
}
