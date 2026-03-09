import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { prosjektStatusLabel, prosjektKategoriLabel } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

async function hentKommune(id: string) {
  return prisma.kommune.findUnique({
    where: { id },
    include: {
      prosjekter: {
        include: {
          prosjekt: {
            select: { id: true, tittel: true, slug: true, status: true, kategori: true },
          },
        },
      },
      _count: { select: { brukere: true } },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const kommune = await hentKommune(id);
  if (!kommune) return { title: "Kommune ikke funnet" };
  return { title: kommune.navn, description: kommune.beskrivelse ?? undefined };
}

export default async function KommuneDetaljSide({ params }: Props) {
  const { id } = await params;
  const kommune = await hentKommune(id);
  if (!kommune) notFound();

  return (
    <div className="py-10">
      <div className="container-kyst">
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/kommuner" className="hover:text-slate-900">Kommuner</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-700">{kommune.navn}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-extrabold text-slate-900">{kommune.navn}</h1>
            <p className="mt-1 text-lg text-slate-500">{kommune.fylke}</p>
            {kommune.beskrivelse && (
              <p className="mt-4 text-slate-600 leading-relaxed">{kommune.beskrivelse}</p>
            )}

            {/* Prosjekter */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Prosjekter ({kommune.prosjekter.length})
              </h2>
              {kommune.prosjekter.length > 0 ? (
                <div className="space-y-3">
                  {kommune.prosjekter.map(({ prosjekt }) => (
                    <Link
                      key={prosjekt.id}
                      href={`/prosjekter/${prosjekt.slug}`}
                      className="card flex items-center justify-between p-4 group"
                    >
                      <div>
                        <p className="font-semibold text-slate-900 group-hover:text-hav-700 transition-colors">
                          {prosjekt.tittel}
                        </p>
                        <p className="text-sm text-slate-500">{prosjektKategoriLabel(prosjekt.kategori)}</p>
                      </div>
                      <span className="badge bg-slate-100 text-slate-600 text-xs">
                        {prosjektStatusLabel(prosjekt.status)}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">Ingen prosjekter ennå.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="card h-fit p-6 space-y-4">
            <h2 className="font-bold text-slate-900">Fakta om kommunen</h2>
            {kommune.nummer && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Kommunenummer</p>
                <p className="mt-1 text-sm font-medium text-slate-700">{kommune.nummer}</p>
              </div>
            )}
            {kommune.befolkning && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Befolkning</p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  {kommune.befolkning.toLocaleString("nb-NO")} innbyggere
                </p>
              </div>
            )}
            {kommune.areal && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Areal</p>
                <p className="mt-1 text-sm font-medium text-slate-700">{kommune.areal} km²</p>
              </div>
            )}
            {kommune.kystlinje && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Kystlinje</p>
                <p className="mt-1 text-sm font-medium text-slate-700">{kommune.kystlinje} km</p>
              </div>
            )}
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Registrerte brukere</p>
              <p className="mt-1 text-sm font-medium text-slate-700">{kommune._count.brukere}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
