import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { RessursType } from "@prisma/client";

export const metadata: Metadata = {
  title: "Ressurser",
  description: "Dokumenter, maler, rapporter og veiledninger for kystkommuner.",
};

const typeLabel: Record<RessursType, string> = {
  DOKUMENT: "Dokument",
  MAL: "Mal",
  RAPPORT: "Rapport",
  VEILEDNING: "Veiledning",
  LENKE: "Lenke",
};

const typeFarge: Record<RessursType, string> = {
  DOKUMENT: "bg-blue-50 text-blue-700",
  MAL: "bg-purple-50 text-purple-700",
  RAPPORT: "bg-amber-50 text-amber-700",
  VEILEDNING: "bg-kyst-50 text-kyst-700",
  LENKE: "bg-slate-100 text-slate-700",
};

const typeIkon: Record<RessursType, string> = {
  DOKUMENT: "📄",
  MAL: "📝",
  RAPPORT: "📊",
  VEILEDNING: "📚",
  LENKE: "🔗",
};

export default async function RessurserSide() {
  const ressurser = await prisma.ressurs.findMany({
    include: { kommune: { select: { id: true, navn: true } } },
    orderBy: { createdAt: "desc" },
  });

  const etterType = ressurser.reduce<Record<string, typeof ressurser>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {});

  return (
    <div className="py-10">
      <div className="container-kyst">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900">Ressurser</h1>
          <p className="mt-2 text-lg text-slate-500">
            Dokumenter, maler og veiledninger delt av kystnettveket
          </p>
        </div>

        {ressurser.length > 0 ? (
          <div className="space-y-10">
            {Object.entries(etterType).map(([type, rs]) => (
              <div key={type}>
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-xl">{typeIkon[type as RessursType]}</span>
                  <h2 className="text-xl font-bold text-slate-800">
                    {typeLabel[type as RessursType]}r
                  </h2>
                  <span className="text-sm text-slate-400">({rs.length})</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {rs.map((r) => (
                    <a
                      key={r.id}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card block p-5 group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold text-slate-900 group-hover:text-hav-700 transition-colors">
                          {r.tittel}
                        </h3>
                        <span className={`badge shrink-0 ${typeFarge[r.type]}`}>
                          {typeLabel[r.type]}
                        </span>
                      </div>
                      {r.beskrivelse && (
                        <p className="mt-2 text-sm text-slate-500 line-clamp-2">{r.beskrivelse}</p>
                      )}
                      {r.kommune && (
                        <p className="mt-2 text-xs text-slate-400">Fra: {r.kommune.navn}</p>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <p className="text-slate-500">Ingen ressurser lagt til ennå.</p>
          </div>
        )}
      </div>
    </div>
  );
}
