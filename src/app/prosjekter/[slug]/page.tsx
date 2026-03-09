import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  formatDate,
  formatCurrency,
  prosjektStatusLabel,
  prosjektKategoriLabel,
} from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

async function hentProsjekt(slug: string) {
  return prisma.prosjekt.findUnique({
    where: { slug },
    include: {
      kommuner: { include: { kommune: true } },
      milestones: { orderBy: { forfallsDato: "asc" } },
      tags: { include: { tag: true } },
      innlegg: {
        where: { publisert: true },
        include: { forfatter: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      _count: { select: { medlemmer: true } },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const prosjekt = await hentProsjekt(slug);
  if (!prosjekt) return { title: "Prosjekt ikke funnet" };
  return {
    title: prosjekt.tittel,
    description: prosjekt.beskrivelse.slice(0, 160),
  };
}

const statusFarge: Record<string, string> = {
  AKTIV: "badge-aktiv",
  PLANLAGT: "badge-planlagt",
  FULLFORT: "badge-fullfort",
  PAUSERT: "badge-pausert",
  AVLYST: "badge-avlyst",
};

export default async function ProsjektDetaljSide({ params }: Props) {
  const { slug } = await params;
  const prosjekt = await hentProsjekt(slug);

  if (!prosjekt) notFound();

  const fullforte = prosjekt.milestones.filter((m) => m.fullfort).length;
  const milestoneProgresjon =
    prosjekt.milestones.length > 0
      ? Math.round((fullforte / prosjekt.milestones.length) * 100)
      : 0;

  return (
    <div className="py-10">
      <div className="container-kyst">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/prosjekter" className="hover:text-slate-900">
            Prosjekter
          </Link>
          <span className="mx-2">›</span>
          <span className="text-slate-700">{prosjekt.tittel}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={statusFarge[prosjekt.status] ?? "badge"}>
                  {prosjektStatusLabel(prosjekt.status)}
                </span>
                <span className="badge bg-slate-100 text-slate-700">
                  {prosjektKategoriLabel(prosjekt.kategori)}
                </span>
                {prosjekt.tags.map(({ tag }) => (
                  <span key={tag.id} className="badge bg-hav-50 text-hav-700">
                    {tag.navn}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900">{prosjekt.tittel}</h1>
              <p className="mt-4 text-lg text-slate-600 leading-relaxed">{prosjekt.beskrivelse}</p>
            </div>

            {/* Milestones */}
            {prosjekt.milestones.length > 0 && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900">Milepæler</h2>
                  <span className="text-sm text-slate-500">
                    {fullforte}/{prosjekt.milestones.length} fullført
                  </span>
                </div>
                <div className="mb-4 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-kyst-500 transition-all"
                    style={{ width: `${milestoneProgresjon}%` }}
                  />
                </div>
                <ul className="space-y-3">
                  {prosjekt.milestones.map((m) => (
                    <li key={m.id} className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 h-5 w-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center text-xs ${
                          m.fullfort
                            ? "border-kyst-500 bg-kyst-500 text-white"
                            : "border-slate-300"
                        }`}
                      >
                        {m.fullfort && "✓"}
                      </span>
                      <div>
                        <p className={`text-sm font-medium ${m.fullfort ? "text-slate-400 line-through" : "text-slate-800"}`}>
                          {m.tittel}
                        </p>
                        {m.beskrivelse && (
                          <p className="text-xs text-slate-500 mt-0.5">{m.beskrivelse}</p>
                        )}
                        {m.forfallsDato && (
                          <p className="text-xs text-slate-400 mt-0.5">
                            Frist: {formatDate(m.forfallsDato)}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Innlegg */}
            {prosjekt.innlegg.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Oppdateringer</h2>
                <div className="space-y-4">
                  {prosjekt.innlegg.map((innlegg) => (
                    <Link
                      key={innlegg.id}
                      href={`/innlegg/${innlegg.slug}`}
                      className="card block p-5 group"
                    >
                      <h3 className="font-semibold text-slate-900 group-hover:text-hav-700 transition-colors">
                        {innlegg.tittel}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 line-clamp-2">{innlegg.innhold}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                        <span>{innlegg.forfatter.name}</span>
                        <span>·</span>
                        <span>{formatDate(innlegg.createdAt)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info */}
            <div className="card p-6 space-y-4">
              <h2 className="font-bold text-slate-900">Prosjektinfo</h2>
              {prosjekt.budsjett && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Budsjett</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {formatCurrency(prosjekt.budsjett)}
                  </p>
                </div>
              )}
              {prosjekt.startDato && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Oppstart</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {formatDate(prosjekt.startDato)}
                  </p>
                </div>
              )}
              {prosjekt.sluttDato && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Avslutning</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {formatDate(prosjekt.sluttDato)}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Deltakere</p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  {prosjekt._count.medlemmer} person{prosjekt._count.medlemmer !== 1 ? "er" : ""}
                </p>
              </div>
            </div>

            {/* Kommuner */}
            <div className="card p-6">
              <h2 className="font-bold text-slate-900 mb-3">Deltakende kommuner</h2>
              <ul className="space-y-3">
                {prosjekt.kommuner.map(({ kommune, rolle }) => (
                  <li key={kommune.id}>
                    <Link
                      href={`/kommuner/${kommune.id}`}
                      className="flex items-center justify-between group"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800 group-hover:text-hav-700 transition-colors">
                          {kommune.navn}
                        </p>
                        <p className="text-xs text-slate-400">{kommune.fylke}</p>
                      </div>
                      {rolle && (
                        <span className="text-xs text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">
                          {rolle}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button className="btn-primary w-full justify-center">Bli med i prosjektet</button>
              <button className="btn-secondary w-full justify-center">Del prosjektet</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
