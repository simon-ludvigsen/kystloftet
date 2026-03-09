import Link from "next/link";

const lenker = {
  Plattform: [
    { href: "/prosjekter", label: "Prosjekter" },
    { href: "/kommuner", label: "Kommuner" },
    { href: "/ressurser", label: "Ressurser" },
    { href: "/statistikk", label: "Statistikk" },
  ],
  Om: [
    { href: "/om-oss", label: "Om Kystløftet" },
    { href: "/om-oss#bakgrunn", label: "Bakgrunn" },
    { href: "/om-oss#kontakt", label: "Kontakt" },
  ],
  Konto: [
    { href: "/logg-inn", label: "Logg inn" },
    { href: "/registrer", label: "Registrer deg" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container-kyst py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-lg font-bold text-hav-800">Kystløftet</p>
            <p className="mt-2 text-sm text-slate-500">
              Nasjonal plattform for samarbeid mellom norske kystkommuner.
            </p>
          </div>

          {/* Links */}
          {Object.entries(lenker).map(([tittel, items]) => (
            <div key={tittel}>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {tittel}
              </p>
              <ul className="mt-4 space-y-2">
                {items.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-slate-200 pt-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Kystløftet. Bygget for norske kystkommuner.
        </div>
      </div>
    </footer>
  );
}
