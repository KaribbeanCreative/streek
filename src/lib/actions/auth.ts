"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error: string } | { notice: string } | null;

/**
 * Connexion email + mot de passe.
 * Retourne `{ error }` en cas d'échec ; redirige vers /dashboard si succès.
 * Signature compatible `useActionState` (prevState, formData).
 */
export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  redirect("/dashboard");
}

/**
 * Inscription email + mot de passe.
 * Avec « Confirm email » désactivé (dev), l'utilisateur est connecté direct.
 */
export async function register(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return { error: error.message };

  // « Confirm email » activé côté Supabase : pas de session immédiate.
  // Le lien reçu par mail passe par /auth/confirm et connecte directement.
  if (!data.session) {
    return {
      notice:
        "Compte créé ! Clique sur le lien dans l'email de confirmation pour accéder à ton tableau de bord.",
    };
  }

  redirect("/dashboard");
}

/** Déconnexion : invalide la session puis renvoie vers /login. */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
