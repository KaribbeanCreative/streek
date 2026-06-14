import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Confirmation d'email Supabase (flux SSR `token_hash`).
 *
 * Le lien reçu par mail pointe vers `/auth/confirm?token_hash=…&type=…`.
 * On échange ce jeton contre une session (cookies posés par le client serveur),
 * ce qui connecte directement l'utilisateur, puis on redirige vers `next`.
 *
 * Contrairement au flux `code` (PKCE), `verifyOtp` ne dépend pas d'un cookie
 * posé lors de l'inscription : le lien marche donc même ouvert sur un autre
 * appareil (ex. mobile).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  // Lien invalide ou expiré : on renvoie vers la connexion avec un indicateur.
  return NextResponse.redirect(new URL("/login?error=confirm", origin));
}
