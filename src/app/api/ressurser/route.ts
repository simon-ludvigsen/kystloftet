import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { RessursType } from "@prisma/client";

const RessursSchema = z.object({
  tittel: z.string().min(3).max(200),
  beskrivelse: z.string().optional(),
  type: z.nativeEnum(RessursType),
  url: z.string().url(),
  kommuneId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as RessursType | null;
  const kommuneId = searchParams.get("kommuneId");

  const ressurser = await prisma.ressurs.findMany({
    where: {
      ...(type && { type }),
      ...(kommuneId && { kommuneId }),
    },
    include: {
      kommune: { select: { id: true, navn: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: ressurser });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }

  const body = await request.json();
  const result = RessursSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const ressurs = await prisma.ressurs.create({ data: result.data });

  return NextResponse.json({ data: ressurs }, { status: 201 });
}
