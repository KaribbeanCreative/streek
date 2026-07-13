"use client";

import { useActionState } from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { sendMagicLink } from "../actions/send-magic-link";
import type { MagicLinkState } from "../types";

const initialState: MagicLinkState = { status: "idle" };

export function LoginForm({ linkError }: { linkError?: boolean }) {
  const [state, formAction, isPending] = useActionState(
    sendMagicLink,
    initialState
  );

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Sign in</CardTitle>
        <CardDescription>
          No password needed — we&apos;ll email you a magic link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              className="h-11"
            />
          </div>
          <div className="flex items-start gap-3">
            <Checkbox id="marketing_opt_in" name="marketing_opt_in" className="mt-0.5" />
            <Label
              htmlFor="marketing_opt_in"
              className="text-sm font-normal text-muted-foreground"
            >
              Receive news and offers by email
            </Label>
          </div>
          <Button type="submit" disabled={isPending} className="h-11 w-full">
            {isPending
              ? "Sending…"
              : state.status === "sent"
                ? "Resend link"
                : "Send magic link"}
          </Button>
          <div aria-live="polite">
            {state.status === "sent" && (
              <p className="text-sm text-success">
                Magic link sent to <strong>{state.email}</strong>. Check your
                inbox and tap the link on this device.
              </p>
            )}
            {state.status === "error" && (
              <p className="text-sm text-error">{state.message}</p>
            )}
            {linkError && state.status === "idle" && (
              <p className="text-sm text-error">
                That link is invalid or has expired. Request a new one.
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
