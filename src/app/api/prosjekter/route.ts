import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { ProsjektStatus, ProsjektKategori } from "@prisma/client";

const ProsjektSchema = z.object({
  tittel: z.string().min(3).max(120),
  beskrivelse: z.string().min(10),
  kategori: z.nativeEnum(ProsjektKategori),
  budsjett: z.number().positive().optional(),
  startDato: z.string().datetime().optional(),
  sluttDato: z.string().datetime().optional(),
  kommuneIder: z.array(z.string()).min(1),
  tags: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as ProsjektStatus | null;
  const kategori = searchParams.get("kategori") as ProsjektKategori | null;
  const kommuneId = searchParams.get("kommuneId");
  const side = parseInt(searchParams.get("side") ?? "1");
  const sideStoerrelse = parseInt(searchParams.get("sideStoerrelse") ?? "12");

  const where = {
    ...(status && { status }),
    ...(kategori && { kategori }),
    ...(kommuneId && { kommuner: { some: { kommuneId } } }),
  };

  const [prosjekter, total] = await Promise.all([
    prisma.prosjekt.findMany({
      where,
      include: {
        kommuner: {
          include: {
            kommune: { select: { id: true, navn: true, fylke: true } },
          },
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

  return NextResponse.json({
    data: prosjekter,
    total,
    side,
    sideStoerrelse,
    harFlere: total > side * sideStoerrelse,
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }
  if (!["ADMIN", "KOORDINATOR"].includes(session.user.rolle ?? "")) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const body = await request.json();
  const result = ProsjektSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const { tittel, beskrivelse, kategori, budsjett, startDato, sluttDato, kommuneIder, tags } =
    result.data;

  const slug = slugify(tittel);

  const prosjekt = await prisma.prosjekt.create({
    data: {
      tittel,
      slug,
      beskrivelse,
      kategori,
      budsjett,
      startDato: startDato ? new Date(startDato) : undefined,
      sluttDato: sluttDato ? new Date(sluttDato) : undefined,
      kommuner: {
        create: kommuneIder.map((id, idx) => ({
          kommuneId: id,
          rolle: idx === 0 ? "Lederkommune" : "Samarbeidspartner",
        })),
      },
      ...(tags?.length && {
        tags: {
          create: await Promise.all(
            tags.map(async (navn) => {
              const tag = await prisma.tag.upsert({
                where: { navn },
                create: { navn },
                update: {},
              });
              return { tagId: tag.id };
            })
          ),
        },
      }),
    },
    include: {
      kommuner: { include: { kommune: true } },
      tags: { include: { tag: true } },
    },
  });

  return NextResponse.json({ data: prosjekt }, { status: 201 });
}
