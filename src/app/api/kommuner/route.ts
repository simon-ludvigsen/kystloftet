import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fylke = searchParams.get("fylke");
  const sok = searchParams.get("sok");

  const kommuner = await prisma.kommune.findMany({
    where: {
      ...(fylke && { fylke }),
      ...(sok && { navn: { contains: sok, mode: "insensitive" } }),
    },
    include: {
      _count: { select: { brukere: true, prosjekter: true } },
    },
    orderBy: { navn: "asc" },
  });

  return NextResponse.json({ data: kommuner });
}
