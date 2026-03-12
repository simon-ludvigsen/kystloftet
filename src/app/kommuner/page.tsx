import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Kommuner",
  description: "Oversikt over kystkommuner i Kystløftet-nettverket.",
};

export default async function KommunerSide() {
  const kommuner = await prisma.kommune.findMany({
    include: {
      _count: { select: { brukere: true, prosjekter: true } },
    },
    orderBy: [{ fylke: "asc" }, { navn: "asc" }],
  });

  const etterFylke = kommuner.reduce<Record<string, typeof kommuner>>((acc, k) => {
    if (!acc[k.fylke]) acc[k.fylke] = [];
    acc[k.fylke].push(k);
    return acc;
  }, {});

  return (
    <div className="py-10">
      <div className="container-kyst">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900">Kommuner</h1>
          <p className="mt-2 text-lg text-slate-500">
            {kommuner.length} kystkommuner i nettverket
          </p>
        </div>

        {Object.keys(etterFylke).length > 0 ? (
          <div className="space-y-10">
            {Object.entries(etterFylke).map(([fylke, ks]) => (
              <div key={fylke}>
                <h2 className="mb-4 text-xl font-bold text-slate-700 border-b border-slate-200 pb-2">
                  {fylke}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {ks.map((k) => (
                    <Link
                      key={k.id}
                      href={`/kommuner/${k.id}`}
                      className="card group block p-5"
                    >
                      <h3 className="font-bold text-slate-900 group-hover:text-hav-700 transition-colors">
                        {k.navn}
                      </h3>
                      {k.beskrivelse && (
                        <p className="mt-1.5 text-sm text-slate-500 line-clamp-2">
                          {k.beskrivelse}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                        {k.befolkning && (
                          <span>{k.befolkning.toLocaleString("nb-NO")} innb.</span>
                        )}
                        {k.kystlinje && <span>{k.kystlinje} km kystlinje</span>}
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                        <span>{k._count.prosjekter} prosjekt{k._count.prosjekter !== 1 ? "er" : ""}</span>
                        <span>·</span>
                        <span>{k._count.brukere} bruker{k._count.brukere !== 1 ? "e" : ""}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <p className="text-slate-500">Ingen kommuner er registrert ennå.</p>
          </div>
        )}
      </div>
    </div>
  );
}
