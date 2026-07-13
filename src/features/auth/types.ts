export type MagicLinkState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "sent"; email: string };
