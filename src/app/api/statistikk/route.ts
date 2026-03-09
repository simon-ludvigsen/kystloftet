import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [
    totaltProsjekter,
    aktiveProsjekter,
    totaltKommuner,
    totaltBrukere,
    totaltRessurser,
    prosjekterPerKategori,
  ] = await Promise.all([
    prisma.prosjekt.count(),
    prisma.prosjekt.count({ where: { status: "AKTIV" } }),
    prisma.kommune.count(),
    prisma.user.count(),
    prisma.ressurs.count(),
    prisma.prosjekt.groupBy({
      by: ["kategori"],
      _count: { kategori: true },
      orderBy: { _count: { kategori: "desc" } },
    }),
  ]);

  return NextResponse.json({
    data: {
      totaltProsjekter,
      aktiveProsjekter,
      totaltKommuner,
      totaltBrukere,
      totaltRessurser,
      prosjekterPerKategori: prosjekterPerKategori.map((r) => ({
        kategori: r.kategori,
        antall: r._count.kategori,
      })),
    },
  });
}
