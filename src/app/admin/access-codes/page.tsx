import { prisma } from "@/lib/db";
import AccessCodeForm from "@/components/AccessCodeForm";

export default async function AccessCodesPage() {
  const codes = await prisma.access_codes.findMany({ orderBy: { created_at: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">Trip Access Codes</h1>
        <p className="sub mt-1">Give these out to your tryout batch — friends get in with a code, everyone else sees the Coming Soon gate.</p>
      </div>

      <AccessCodeForm />

      {codes.length === 0 ? (
        <div className="card text-center py-12">
          <p className="sub">No codes yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {codes.map((c) => {
            const expired = !!c.expires_at && c.expires_at <= new Date();
            const usedUp = c.max_uses != null && c.use_count >= c.max_uses;
            const locked = !c.is_active || expired || usedUp;
            return (
              <div key={c.id} className="card flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="font-mono font-bold text-lg text-haiti-navy dark:text-haiti-turquoise">{c.code}</p>
                  {c.label && <p className="text-sm sub">{c.label}</p>}
                  <p className="text-xs sub mt-1">
                    Used {c.use_count}
                    {c.max_uses != null ? ` / ${c.max_uses}` : ""} times
                    {c.expires_at ? ` · expires ${new Date(c.expires_at).toLocaleDateString()}` : ""}
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    locked ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-600"
                  }`}
                >
                  {locked ? "Locked" : "Active"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
