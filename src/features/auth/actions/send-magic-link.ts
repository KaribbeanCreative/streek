"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createClient } from "@/shared/lib/supabase/server";
import type { MagicLinkState } from "../types";

const magicLinkSchema = z.object({
  email: z.email(),
  marketingOptIn: z.boolean(),
});

export async function sendMagicLink(
  _prevState: MagicLinkState,
  formData: FormData
): Promise<MagicLinkState> {
  const parsed = magicLinkSchema.safeParse({
    email: String(formData.get("email") ?? "")
      .trim()
      .toLowerCase(),
    marketingOptIn: formData.get("marketing_opt_in") === "on",
  });

  if (!parsed.success) {
    return { status: "error", message: "Enter a valid email address." };
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=/habits`,
      data: { marketing_opt_in: parsed.data.marketingOptIn },
    },
  });

  if (error) {
    return {
      status: "error",
      message: "Could not send the magic link. Please try again.",
    };
  }

  return { status: "sent", email: parsed.data.email };
}
