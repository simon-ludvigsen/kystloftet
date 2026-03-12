"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ProsjektStatus, ProsjektKategori } from "@prisma/client";
import { prosjektStatusLabel, prosjektKategoriLabel } from "@/lib/utils";

export function ProsjektFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") ?? "";
  const currentKategori = searchParams.get("kategori") ?? "";

  function oppdaterFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("side");
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={currentStatus}
        onChange={(e) => oppdaterFilter("status", e.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-hav-500 focus:outline-none focus:ring-1 focus:ring-hav-500"
      >
        <option value="">Alle statuser</option>
        {Object.values(ProsjektStatus).map((s) => (
          <option key={s} value={s}>
            {prosjektStatusLabel(s)}
          </option>
        ))}
      </select>

      <select
        value={currentKategori}
        onChange={(e) => oppdaterFilter("kategori", e.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-hav-500 focus:outline-none focus:ring-1 focus:ring-hav-500"
      >
        <option value="">Alle kategorier</option>
        {Object.values(ProsjektKategori).map((k) => (
          <option key={k} value={k}>
            {prosjektKategoriLabel(k)}
          </option>
        ))}
      </select>

      {(currentStatus || currentKategori) && (
        <button
          onClick={() => router.push("/prosjekter")}
          className="text-sm text-slate-500 hover:text-slate-900 underline"
        >
          Nullstill filtre
        </button>
      )}
    </div>
  );
}
