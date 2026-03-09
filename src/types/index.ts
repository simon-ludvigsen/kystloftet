import type {
  User,
  Kommune,
  Prosjekt,
  Milestone,
  Tag,
  Innlegg,
  Kommentar,
  Ressurs,
  ProsjektStatus,
  ProsjektKategori,
  Role,
  RessursType,
} from "@prisma/client";

// Re-export Prisma enums
export { ProsjektStatus, ProsjektKategori, Role, RessursType };

// Extended types with relations
export type ProsjektMedKommuner = Prosjekt & {
  kommuner: Array<{
    rolle: string | null;
    kommune: Pick<Kommune, "id" | "navn" | "fylke">;
  }>;
  tags: Array<{ tag: Tag }>;
  _count: { medlemmer: number; innlegg: number };
};

export type ProsjektDetalj = Prosjekt & {
  kommuner: Array<{
    rolle: string | null;
    kommune: Kommune;
  }>;
  milestones: Milestone[];
  tags: Array<{ tag: Tag }>;
  innlegg: Array<
    Innlegg & { forfatter: Pick<User, "id" | "name" | "image"> }
  >;
  _count: { medlemmer: number };
};

export type KommuneMedProsjekter = Kommune & {
  prosjekter: Array<{
    prosjekt: Pick<Prosjekt, "id" | "tittel" | "slug" | "status" | "kategori">;
  }>;
  _count: { brukere: number };
};

export type InnleggMedForfatter = Innlegg & {
  forfatter: Pick<User, "id" | "name" | "image">;
  prosjekt: Pick<Prosjekt, "id" | "tittel" | "slug"> | null;
  _count: { kommentarer: number };
};

export type KommentarMedForfatter = Kommentar & {
  forfatter: Pick<User, "id" | "name" | "image">;
};

// API response types
export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };

export type PaginertSvar<T> = {
  data: T[];
  total: number;
  side: number;
  sideStoerrelse: number;
  harFlere: boolean;
};
