"use client";

export function Greeting({ name }: { name: string }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-flame-from to-flame-to font-heading text-lg font-bold text-white"
      >
        {name.charAt(0).toUpperCase()}
      </span>
      <div>
        <p
          suppressHydrationWarning
          className="text-sm text-muted-foreground"
        >
          {greeting}
        </p>
        <p className="font-heading text-lg font-bold capitalize">{name}</p>
      </div>
    </div>
  );
}
