type Farge = "hav" | "kyst" | "sand" | "slate";

const fargeKlasser: Record<Farge, string> = {
  hav: "text-hav-700",
  kyst: "text-kyst-700",
  sand: "text-sand-600",
  slate: "text-slate-700",
};

export function StatistikkKort({
  verdi,
  label,
  farge = "hav",
}: {
  verdi: number;
  label: string;
  farge?: Farge;
}) {
  return (
    <div className="text-center">
      <p className={`text-4xl font-extrabold tabular-nums ${fargeKlasser[farge]}`}>
        {verdi.toLocaleString("nb-NO")}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}
