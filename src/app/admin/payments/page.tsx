import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { stripeConfigured } from "@/lib/stripe";
import { moncashConfigured } from "@/lib/moncash";
import { paypalConfigured } from "@/lib/paypal";
import { athmovilConfigured } from "@/lib/athmovil";
import { getUsdToHtgRate } from "@/lib/settings";
import ExchangeRateEditor from "@/components/ExchangeRateEditor";

function formatCurrency(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}

const STATUS_COLORS: Record<string, string> = {
  succeeded: "bg-green-500/10 text-green-600",
  pending: "bg-amber-500/10 text-amber-600",
  failed: "bg-red-500/10 text-red-600",
  refunded: "bg-gray-200 text-gray-600",
};

const METHOD_COLORS: Record<string, string> = {
  stripe: "bg-indigo-500/10 text-indigo-600",
  paypal: "bg-blue-500/10 text-blue-600",
  moncash: "bg-red-500/10 text-red-600",
  athmovil: "bg-orange-500/10 text-orange-600",
};

export default async function PaymentsPage() {
  if (!(await isAdmin())) redirect("/admin/my-trips");

  const [payments, usdToHtgRate] = await Promise.all([
    prisma.payments.findMany({
      include: { reservation: { include: { trip: true } } },
      orderBy: { created_at: "desc" },
    }),
    getUsdToHtgRate(),
  ]);

  const totalSucceeded = payments.filter((p) => p.status === "succeeded").reduce((sum, p) => sum + p.amount_cents, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">Payments</h1>
        <p className="sub mt-1">
          {formatCurrency(totalSucceeded, "usd")} collected · {payments.length} transaction{payments.length === 1 ? "" : "s"}
        </p>
      </div>

      <ExchangeRateEditor currentRate={usdToHtgRate} />

      {(!stripeConfigured || !moncashConfigured || !paypalConfigured || !athmovilConfigured) && (
        <div className="card border-amber-400/40 bg-amber-500/5 space-y-1">
          {!stripeConfigured && (
            <p className="text-sm">
              Stripe isn&apos;t connected yet — add <code className="font-mono">STRIPE_SECRET_KEY</code> (and
              <code className="font-mono"> STRIPE_WEBHOOK_SECRET</code> once you set up a webhook) to <code className="font-mono">.env</code>.
            </p>
          )}
          {!paypalConfigured && (
            <p className="text-sm">
              PayPal isn&apos;t connected yet — add <code className="font-mono">PAYPAL_CLIENT_ID</code> and{" "}
              <code className="font-mono">PAYPAL_CLIENT_SECRET</code> to <code className="font-mono">.env</code>.
            </p>
          )}
          {!moncashConfigured && (
            <p className="text-sm">
              MonCash isn&apos;t connected yet — add <code className="font-mono">MONCASH_CLIENT_ID</code> and{" "}
              <code className="font-mono">MONCASH_CLIENT_SECRET</code> to <code className="font-mono">.env</code>.
            </p>
          )}
          {!athmovilConfigured && (
            <p className="text-sm">
              ATH Móvil isn&apos;t connected yet — add <code className="font-mono">ATHMOVIL_PUBLIC_TOKEN</code> and{" "}
              <code className="font-mono">ATHMOVIL_PRIVATE_TOKEN</code> to <code className="font-mono">.env</code>. (No sandbox exists —
              this one needs a real ATH Business account to test.)
            </p>
          )}
        </div>
      )}

      {payments.length === 0 ? (
        <div className="card text-center py-12">
          <p className="sub">No payments yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => (
            <Link key={p.id} href={`/admin/reservations/${p.reservation_id}`} className="card flex items-center justify-between flex-wrap gap-3 hover:shadow-lg transition-shadow">
              <div>
                <p className="font-bold text-haiti-navy dark:text-haiti-turquoise">{p.reservation.trip.title}</p>
                <p className="text-sm sub capitalize">
                  {p.kind} · {p.method} · {p.reservation.name} · {new Date(p.created_at).toLocaleDateString()}
                </p>
                {p.method === "moncash" && p.moncash_amount_htg != null && (
                  <p className="text-xs sub mt-0.5">{p.moncash_amount_htg.toLocaleString()} HTG</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">{formatCurrency(p.amount_cents, p.currency)}</span>
                <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${METHOD_COLORS[p.method] || "bg-gray-200 text-gray-700"}`}>
                  {p.method}
                </span>
                <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[p.status] || "bg-gray-200 text-gray-700"}`}>{p.status}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
