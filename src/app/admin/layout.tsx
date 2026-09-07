import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/shell";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin — Trekking Nepal",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  // The login page renders bare; every other admin route gets the shell.
  if (!user) return <div className="min-h-screen bg-ink-50">{children}</div>;
  return <AdminShell user={user}>{children}</AdminShell>;
}
