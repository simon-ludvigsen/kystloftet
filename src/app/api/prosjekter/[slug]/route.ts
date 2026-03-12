import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ProsjektStatus } from "@prisma/client";

const OppdaterSchema = z.object({
  tittel: z.string().min(3).max(120).optional(),
  beskrivelse: z.string().min(10).optional(),
  status: z.nativeEnum(ProsjektStatus).optional(),
  budsjett: z.number().positive().optional(),
  startDato: z.string().datetime().optional().nullable(),
  sluttDato: z.string().datetime().optional().nullable(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const prosjekt = await prisma.prosjekt.findUnique({
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

  if (!prosjekt) {
    return NextResponse.json({ error: "Prosjekt ikke funnet" }, { status: 404 });
  }

  return NextResponse.json({ data: prosjekt });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }
  if (!["ADMIN", "KOORDINATOR"].includes(session.user.rolle ?? "")) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const { slug } = await params;
  const body = await request.json();
  const result = OppdaterSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const prosjekt = await prisma.prosjekt.update({
    where: { slug },
    data: {
      ...result.data,
      startDato: result.data.startDato ? new Date(result.data.startDato) : undefined,
      sluttDato: result.data.sluttDato ? new Date(result.data.sluttDato) : undefined,
    },
  });

  return NextResponse.json({ data: prosjekt });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }
  if (session.user.rolle !== "ADMIN") {
    return NextResponse.json({ error: "Kun administratorer kan slette prosjekter" }, { status: 403 });
  }

  const { slug } = await params;

  await prisma.prosjekt.delete({ where: { slug } });

  return new NextResponse(null, { status: 204 });
}
