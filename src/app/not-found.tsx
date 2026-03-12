import Link from "next/link";

export default function IkkeFunnet() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center py-16">
      <p className="text-7xl font-extrabold text-hav-200">404</p>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">Siden ble ikke funnet</h1>
      <p className="mt-3 text-slate-500">
        Siden du leter etter eksisterer ikke eller har blitt flyttet.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Tilbake til forsiden
      </Link>
    </div>
  );
}
