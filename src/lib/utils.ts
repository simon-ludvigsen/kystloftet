import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function prosjektStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PLANLAGT: "Planlagt",
    AKTIV: "Aktiv",
    PAUSERT: "Pausert",
    FULLFORT: "Fullført",
    AVLYST: "Avlyst",
  };
  return labels[status] ?? status;
}

export function prosjektKategoriLabel(kategori: string): string {
  const labels: Record<string, string> = {
    INFRASTRUKTUR: "Infrastruktur",
    NAERING: "Næring",
    KULTUR: "Kultur",
    MILJOE: "Miljø",
    KOMPETANSE: "Kompetanse",
    FRILUFTSLIV: "Friluftsliv",
    HAVBRUK: "Havbruk",
    REISELIV: "Reiseliv",
  };
  return labels[kategori] ?? kategori;
}
