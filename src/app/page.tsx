import Link from "next/link";
import { redirect } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Déjà connecté → direction le dashboard.
  if (user) redirect("/dashboard");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">Streek</h1>
        <p className="max-w-md text-muted-foreground">
          Suivez vos habitudes, vos tâches et vos objectifs. Un jour à la fois.
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/login" className={buttonVariants({ size: "lg" })}>
          Se connecter
        </Link>
        <Link
          href="/register"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Créer un compte
        </Link>
      </div>
    </main>
  );
}
