"use client";

import { ThemeProvider } from "next-themes";

/**
 * Providers client globaux de l'application.
 * - ThemeProvider (next-themes) : thème clair par défaut, bascule via la classe `.dark`.
 *   `enableSystem={false}` force le light tant qu'aucun toggle n'est ajouté.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
