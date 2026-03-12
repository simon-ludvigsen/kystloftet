import Link from "next/link";
import { prosjektStatusLabel, prosjektKategoriLabel } from "@/lib/utils";
import type { ProsjektMedKommuner } from "@/types";

const statusBadge: Record<string, string> = {
  AKTIV: "badge-aktiv",
  PLANLAGT: "badge-planlagt",
  FULLFORT: "badge-fullfort",
  PAUSERT: "badge-pausert",
  AVLYST: "badge-avlyst",
};

export function ProsjektKort({ prosjekt }: { prosjekt: ProsjektMedKommuner }) {
  const kommuneNavn = prosjekt.kommuner
    .slice(0, 2)
    .map((k) => k.kommune.navn)
    .join(", ");

  const ekstraKommuner = prosjekt.kommuner.length - 2;

  return (
    <Link href={`/prosjekter/${prosjekt.slug}`} className="card group block p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <span className={statusBadge[prosjekt.status] ?? "badge bg-slate-100 text-slate-700"}>
          {prosjektStatusLabel(prosjekt.status)}
        </span>
        <span className="text-xs text-slate-400">{prosjektKategoriLabel(prosjekt.kategori)}</span>
      </div>

      {/* Title */}
      <h3 className="mt-3 text-lg font-bold text-slate-900 group-hover:text-hav-700 transition-colors line-clamp-2">
        {prosjekt.tittel}
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm text-slate-500 line-clamp-3">{prosjekt.beskrivelse}</p>

      {/* Tags */}
      {prosjekt.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {prosjekt.tags.slice(0, 3).map(({ tag }) => (
            <span
              key={tag.id}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
            >
              {tag.navn}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="text-xs text-slate-500">
          <span className="font-medium text-slate-700">{kommuneNavn}</span>
          {ekstraKommuner > 0 && ` +${ekstraKommuner} til`}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>{prosjekt._count.medlemmer} medl.</span>
          <span>{prosjekt._count.innlegg} innl.</span>
        </div>
      </div>
    </Link>
  );
}
