import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProsjektKort } from "@/components/prosjekter/ProsjektKort";
import { StatistikkKort } from "@/components/StatistikkKort";
import { formatCurrency, prosjektKategoriLabel } from "@/lib/utils";

async function hentForside() {
  const [prosjekter, stats] = await Promise.all([
    prisma.prosjekt.findMany({
      where: { status: "AKTIV" },
      include: {
        kommuner: {
          include: { kommune: { select: { id: true, navn: true, fylke: true } } },
        },
        tags: { include: { tag: true } },
        _count: { select: { medlemmer: true, innlegg: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    Promise.all([
      prisma.prosjekt.count(),
      prisma.prosjekt.count({ where: { status: "AKTIV" } }),
      prisma.kommune.count(),
      prisma.user.count(),
    ]),
  ]);

  return {
    prosjekter,
    stats: {
      totalt: stats[0],
      aktive: stats[1],
      kommuner: stats[2],
      brukere: stats[3],
    },
  };
}

export default async function Forside() {
  const { prosjekter, stats } = await hentForside();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-hav-950 via-hav-800 to-kyst-900 py-24 text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="container-kyst relative">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-hav-200 ring-1 ring-white/20">
              Nasjonal plattform for kystkommuner
            </span>
            <h1 className="mt-4 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              Løft kysten{" "}
              <span className="text-kyst-300">sammen</span>
            </h1>
            <p className="mt-6 text-xl text-hav-200">
              Kystløftet samler norske kystkommuner om felles prosjekter, deler kunnskap og
              ressurser for å styrke livet ved havet.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/prosjekter" className="btn-primary text-base px-7 py-3">
                Utforsk prosjekter
              </Link>
              <Link
                href="/om-oss"
                className="inline-flex items-center gap-2 rounded-lg px-7 py-3 text-base font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/10"
              >
                Les mer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistikk */}
      <section className="bg-white py-12 shadow-sm">
        <div className="container-kyst">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <StatistikkKort verdi={stats.aktive} label="Aktive prosjekter" farge="hav" />
            <StatistikkKort verdi={stats.totalt} label="Totalt prosjekter" farge="kyst" />
            <StatistikkKort verdi={stats.kommuner} label="Deltakende kommuner" farge="sand" />
            <StatistikkKort verdi={stats.brukere} label="Registrerte brukere" farge="slate" />
          </div>
        </div>
      </section>

      {/* Aktive prosjekter */}
      <section className="py-16">
        <div className="container-kyst">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Aktive prosjekter</h2>
              <p className="mt-1 text-slate-500">Pågående samarbeidsprosjekter langs kysten</p>
            </div>
            <Link href="/prosjekter" className="btn-secondary hidden sm:inline-flex">
              Se alle →
            </Link>
          </div>

          {prosjekter.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {prosjekter.map((p) => (
                <ProsjektKort key={p.id} prosjekt={p} />
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
              <p className="text-slate-500">Ingen aktive prosjekter ennå.</p>
              <Link href="/prosjekter/nytt" className="btn-primary mt-4">
                Start et prosjekt
              </Link>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/prosjekter" className="btn-secondary">
              Se alle prosjekter →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-kyst-900 py-16 text-white">
        <div className="container-kyst text-center">
          <h2 className="text-3xl font-bold">Klar til å løfte din kystkommune?</h2>
          <p className="mt-4 text-kyst-200">
            Bli med i nettverket og start samarbeidet med andre kystkommuner i dag.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/registrer" className="btn-primary">
              Registrer din kommune
            </Link>
            <Link
              href="/om-oss#kontakt"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/10"
            >
              Ta kontakt
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
