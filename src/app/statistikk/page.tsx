import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { prosjektKategoriLabel, prosjektStatusLabel } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Statistikk",
  description: "Nøkkeltall og statistikk for Kystløftet-nettverket.",
};

export default async function StatistikkSide() {
  const [
    prosjekterPerStatus,
    prosjekterPerKategori,
    totaltKommuner,
    totaltBrukere,
    totaltRessurser,
  ] = await Promise.all([
    prisma.prosjekt.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    prisma.prosjekt.groupBy({
      by: ["kategori"],
      _count: { kategori: true },
      orderBy: { _count: { kategori: "desc" } },
    }),
    prisma.kommune.count(),
    prisma.user.count(),
    prisma.ressurs.count(),
  ]);

  const totaltProsjekter = prosjekterPerStatus.reduce((s, r) => s + r._count.status, 0);
  const maks = Math.max(...prosjekterPerKategori.map((r) => r._count.kategori), 1);

  return (
    <div className="py-10">
      <div className="container-kyst">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900">Statistikk</h1>
          <p className="mt-2 text-slate-500">Nøkkeltall fra Kystløftet-nettverket</p>
        </div>

        {/* Nøkkeltall */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 mb-12">
          {[
            { verdi: totaltProsjekter, label: "Prosjekter" },
            { verdi: totaltKommuner, label: "Kommuner" },
            { verdi: totaltBrukere, label: "Brukere" },
            { verdi: totaltRessurser, label: "Ressurser" },
            {
              verdi: prosjekterPerStatus.find((s) => s.status === "AKTIV")?._count.status ?? 0,
              label: "Aktive prosjekter",
            },
          ].map(({ verdi, label }) => (
            <div key={label} className="card p-6 text-center">
              <p className="text-4xl font-extrabold text-hav-700 tabular-nums">
                {verdi.toLocaleString("nb-NO")}
              </p>
              <p className="mt-1 text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Status fordeling */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-900 mb-4">Prosjekter etter status</h2>
            <div className="space-y-3">
              {prosjekterPerStatus.map((r) => (
                <div key={r.status} className="flex items-center gap-3">
                  <span className="w-28 text-sm text-slate-600 shrink-0">
                    {prosjektStatusLabel(r.status)}
                  </span>
                  <div className="flex-1 bg-slate-100 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-hav-500"
                      style={{ width: `${(r._count.status / (totaltProsjekter || 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 w-6 text-right">
                    {r._count.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Kategori fordeling */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-900 mb-4">Prosjekter etter kategori</h2>
            <div className="space-y-3">
              {prosjekterPerKategori.map((r) => (
                <div key={r.kategori} className="flex items-center gap-3">
                  <span className="w-32 text-sm text-slate-600 shrink-0">
                    {prosjektKategoriLabel(r.kategori)}
                  </span>
                  <div className="flex-1 bg-slate-100 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-kyst-500"
                      style={{ width: `${(r._count.kategori / maks) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 w-6 text-right">
                    {r._count.kategori}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
