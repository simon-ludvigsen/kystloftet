import { Suspense } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProsjektKort } from "@/components/prosjekter/ProsjektKort";
import { ProsjektFilter } from "@/components/prosjekter/ProsjektFilter";
import { ProsjektStatus, ProsjektKategori } from "@prisma/client";

export const metadata: Metadata = {
  title: "Prosjekter",
  description: "Alle samarbeidsprosjekter i Kystløftet-nettverket.",
};

interface Props {
  searchParams: Promise<{
    status?: string;
    kategori?: string;
    side?: string;
  }>;
}

export default async function ProsjekterSide({ searchParams }: Props) {
  const params = await searchParams;
  const status = params.status as ProsjektStatus | undefined;
  const kategori = params.kategori as ProsjektKategori | undefined;
  const side = parseInt(params.side ?? "1");
  const sideStoerrelse = 12;

  const where = {
    ...(status && Object.values(ProsjektStatus).includes(status) && { status }),
    ...(kategori && Object.values(ProsjektKategori).includes(kategori) && { kategori }),
  };

  const [prosjekter, total] = await Promise.all([
    prisma.prosjekt.findMany({
      where,
      include: {
        kommuner: {
          include: { kommune: { select: { id: true, navn: true, fylke: true } } },
        },
        tags: { include: { tag: true } },
        _count: { select: { medlemmer: true, innlegg: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (side - 1) * sideStoerrelse,
      take: sideStoerrelse,
    }),
    prisma.prosjekt.count({ where }),
  ]);

  const harFlere = total > side * sideStoerrelse;

  return (
    <div className="py-10">
      <div className="container-kyst">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900">Prosjekter</h1>
          <p className="mt-2 text-lg text-slate-500">
            {total} prosjekt{total !== 1 ? "er" : ""} i Kystløftet-nettverket
          </p>
        </div>

        {/* Filters */}
        <Suspense>
          <ProsjektFilter />
        </Suspense>

        {/* Grid */}
        {prosjekter.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {prosjekter.map((p) => (
              <ProsjektKort key={p.id} prosjekt={p} />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <p className="text-slate-500">Ingen prosjekter funnet med valgte filtre.</p>
          </div>
        )}

        {/* Pagination */}
        {(side > 1 || harFlere) && (
          <div className="mt-10 flex items-center justify-center gap-3">
            {side > 1 && (
              <a
                href={`?side=${side - 1}${status ? `&status=${status}` : ""}${kategori ? `&kategori=${kategori}` : ""}`}
                className="btn-secondary"
              >
                ← Forrige
              </a>
            )}
            <span className="text-sm text-slate-500">Side {side}</span>
            {harFlere && (
              <a
                href={`?side=${side + 1}${status ? `&status=${status}` : ""}${kategori ? `&kategori=${kategori}` : ""}`}
                className="btn-secondary"
              >
                Neste →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
