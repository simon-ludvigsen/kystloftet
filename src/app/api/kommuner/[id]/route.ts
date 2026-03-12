import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const kommune = await prisma.kommune.findUnique({
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

  if (!kommune) {
    return NextResponse.json({ error: "Kommune ikke funnet" }, { status: 404 });
  }

  return NextResponse.json({ data: kommune });
}
