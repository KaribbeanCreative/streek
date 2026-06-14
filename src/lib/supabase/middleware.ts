import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Rafraîchit la session Supabase à chaque requête et réécrit les cookies
 * d'auth. Appelé par `src/proxy.ts` (l'équivalent du middleware en Next.js 16).
 *
 * IMPORTANT : ne pas insérer de logique entre `createServerClient` et
 * `getUser()`, et toujours retourner l'objet `response` tel quel — sinon les
 * cookies de session peuvent se désynchroniser et déconnecter l'utilisateur.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Rafraîchit le token d'auth (vérifié côté serveur Supabase).
  await supabase.auth.getUser();

  return response;
}
