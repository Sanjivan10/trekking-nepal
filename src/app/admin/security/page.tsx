import { ShieldCheck, ShieldAlert, Lock, Activity, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/page-header";
import { MAX_ATTEMPTS, LOCK_MINUTES } from "@/lib/security";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const ACTION_TONE: Record<string, string> = {
  login: "bg-brand-50 text-brand-800 ring-brand-200",
  login_failed: "bg-red-50 text-red-700 ring-red-200",
  create: "bg-blue-50 text-blue-700 ring-blue-200",
  update: "bg-amber-50 text-amber-800 ring-amber-200",
  delete: "bg-red-50 text-red-700 ring-red-200",
};

export default async function AdminSecurityPage() {
  const since = new Date(Date.now() - 24 * 3600_000);
  const [logs, locked, failed24h, totalEvents] = await Promise.all([
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 }).catch(() => []),
    prisma.loginAttempt
      .findMany({ where: { lockedUntil: { gt: new Date() } }, orderBy: { lastAttempt: "desc" } })
      .catch(() => []),
    prisma.auditLog
      .count({ where: { action: "login_failed", createdAt: { gte: since } } })
      .catch(() => 0),
    prisma.auditLog.count().catch(() => 0),
  ]);

  const protections = [
    { label: "Signed session cookie (HMAC-SHA256, httpOnly, SameSite=Lax)", on: true },
    { label: `Database-backed login throttle — ${MAX_ATTEMPTS} attempts, then a ${LOCK_MINUTES}-minute lock`, on: true },
    { label: "CSRF origin check on every admin write", on: true },
    { label: "Constant-time credential comparison", on: true },
    { label: "Admin pages set noindex + no-store", on: true },
    { label: "HSTS, Permissions-Policy, COOP, nosniff, frame protection", on: true },
    { label: "Audit trail of every privileged action", on: true },
    { label: "Public review submissions moderated before publishing", on: true },
    { label: "Upload allow-list: images only, 8 MB cap", on: true },
    {
      label: "Admin password set via environment variable",
      on: Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 12),
      warn: "Password is under 12 characters — lengthen it in Vercel's environment variables.",
    },
  ];

  return (
    <>
      <AdminHeader
        title="Security"
        description="What protects the admin area, who signed in, and what changed."
      />

      <div className="space-y-8 p-4 sm:p-6 lg:p-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Failed sign-ins (24h)", value: failed24h, icon: ShieldAlert, tone: failed24h > 5 ? "text-red-600" : "text-ink-900" },
            { label: "Currently locked out", value: locked.length, icon: Lock, tone: locked.length ? "text-amber-600" : "text-ink-900" },
            { label: "Audited events", value: totalEvents, icon: Activity, tone: "text-ink-900" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-ink-200 bg-white p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink-100 text-ink-600">
                <stat.icon size={19} aria-hidden />
              </span>
              <p className={`mt-4 text-2xl font-extrabold ${stat.tone}`}>{stat.value}</p>
              <p className="text-sm font-semibold text-ink-600">{stat.label}</p>
            </div>
          ))}
        </div>

        <section className="rounded-2xl border border-ink-200 bg-white p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">Active protections</h2>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {protections.map((p) => (
              <li key={p.label} className="flex items-start gap-2.5 text-sm">
                {p.on ? (
                  <ShieldCheck size={16} className="mt-0.5 shrink-0 text-brand-600" aria-hidden />
                ) : (
                  <ShieldAlert size={16} className="mt-0.5 shrink-0 text-amber-600" aria-hidden />
                )}
                <span className={p.on ? "text-ink-700" : "text-amber-800"}>
                  {p.label}
                  {!p.on && p.warn && <span className="mt-0.5 block text-xs">{p.warn}</span>}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {locked.length > 0 && (
          <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-amber-800">
              <Lock size={14} aria-hidden />
              Locked out right now
            </h2>
            <ul className="mt-3 space-y-1.5 text-sm text-amber-900">
              {locked.map((row) => (
                <li key={row.id} className="flex items-center gap-2">
                  <code className="rounded bg-white px-1.5 py-0.5 text-xs">{row.identifier}</code>
                  <span className="text-xs">
                    {row.count} failed attempts · unlocks{" "}
                    {row.lockedUntil?.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
          <div className="border-b border-ink-100 px-5 py-3">
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">
              Audit trail · last {logs.length} events
            </h2>
          </div>
          {logs.length === 0 ? (
            <p className="p-6 text-sm text-ink-500">No events recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
                  <tr>
                    <th className="px-4 py-2.5 font-bold">When</th>
                    <th className="px-4 py-2.5 font-bold">Actor</th>
                    <th className="px-4 py-2.5 font-bold">Action</th>
                    <th className="px-4 py-2.5 font-bold">Entity</th>
                    <th className="px-4 py-2.5 font-bold">Detail</th>
                    <th className="px-4 py-2.5 font-bold">IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-ink-50">
                      <td className="whitespace-nowrap px-4 py-2.5 text-xs text-ink-500">
                        <span className="flex items-center gap-1.5">
                          <Clock size={11} aria-hidden />
                          {formatDate(log.createdAt)}{" "}
                          {log.createdAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </td>
                      <td className="max-w-[12rem] truncate px-4 py-2.5 font-medium text-ink-800">{log.actor}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${ACTION_TONE[log.action] ?? "bg-ink-100 text-ink-700 ring-ink-200"}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-ink-600">{log.entity}</td>
                      <td className="max-w-[18rem] truncate px-4 py-2.5 text-ink-600">{log.summary || "—"}</td>
                      <td className="px-4 py-2.5 text-xs text-ink-400">{log.ip || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
