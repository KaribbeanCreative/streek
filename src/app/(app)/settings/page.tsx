import { signOut } from "@/features/auth";
import { LogOutIcon } from "@/shared/icons";
import { createClient } from "@/shared/lib/supabase/server";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { ThemeToggle } from "@/shared/ui/theme-toggle";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardContent className="flex flex-col divide-y px-4 py-0">
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm font-medium">Account</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <p className="text-sm font-medium">Theme</p>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      <form action={signOut}>
        <Button
          type="submit"
          variant="outline"
          className="h-11 w-full text-error"
        >
          <LogOutIcon className="size-4" />
          Sign out
        </Button>
      </form>
    </div>
  );
}
