import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Om Kystløftet",
  description: "Lær mer om Kystløftet – hvorfor vi finnes og hvem som er med.",
};

const verdier = [
  {
    tittel: "Samarbeid",
    beskrivelse:
      "Vi tror på kraften i fellesskapet. Gjennom interkommunalt samarbeid oppnår vi mer enn det noen enkelt kommune kan gjøre alene.",
    ikon: "🤝",
  },
  {
    tittel: "Åpenhet",
    beskrivelse:
      "Kunnskap deles fritt. Alle kommuner har tilgang til samme ressurser, erfaringer og verktøy uavhengig av størrelse.",
    ikon: "🔓",
  },
  {
    tittel: "Bærekraft",
    beskrivelse:
      "Løsningene vi utvikler skal vare. Vi tar hensyn til miljø, økonomi og sosiale forhold i alle prosjekter.",
    ikon: "🌊",
  },
  {
    tittel: "Lokalt eierskap",
    beskrivelse:
      "Kommunene eier prosjektene. Vi er et verktøy og en plattform – ikke en overkommune.",
    ikon: "⚓",
  },
];

export default function OmOssSide() {
  return (
    <div className="py-10">
      {/* Hero */}
      <div className="bg-gradient-to-br from-hav-950 to-hav-800 py-20 text-white">
        <div className="container-kyst max-w-3xl">
          <h1 className="text-5xl font-extrabold leading-tight">
            Vi løfter kysten – <br />
            <span className="text-kyst-300">sammen.</span>
          </h1>
          <p className="mt-6 text-xl text-hav-200">
            Kystløftet er en nasjonal plattform som samler kystkommuner fra Lindesnes til
            Nordkapp for å styrke samarbeid, dele kunnskap og gjennomføre prosjekter som
            gjør hverdagen bedre for folk som bor og arbeider ved havet.
          </p>
        </div>
      </div>

      {/* Bakgrunn */}
      <div id="bakgrunn" className="py-16">
        <div className="container-kyst max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900">Bakgrunn</h2>
          <div className="mt-6 space-y-4 text-slate-600 leading-relaxed">
            <p>
              Norske kystkommuner har en nøkkelrolle i landets økonomi og identitet. Fiskeri,
              havbruk, reiseliv og maritim industri skaper verdier for hele nasjonen – men
              kommunene opplever ofte de samme utfordringene: fraflytting, ressursmangel og
              behovet for å gjøre mer med mindre.
            </p>
            <p>
              Kystløftet ble etablert for å gi disse kommunene et felles verktøy. En arena
              der erfaringer deles, prosjekter samordnes og ressurser brukes smartere.
            </p>
            <p>
              Plattformen er bygget av og for kystkommuner – og er gratis å bruke for alle
              registrerte kommuner.
            </p>
          </div>
        </div>
      </div>

      {/* Verdier */}
      <div className="bg-slate-50 py-16">
        <div className="container-kyst">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Verdiene våre</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {verdier.map((v) => (
              <div key={v.tittel} className="text-center">
                <div className="text-4xl mb-3">{v.ikon}</div>
                <h3 className="text-lg font-bold text-slate-900">{v.tittel}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{v.beskrivelse}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kontakt */}
      <div id="kontakt" className="py-16">
        <div className="container-kyst max-w-xl text-center">
          <h2 className="text-3xl font-bold text-slate-900">Ta kontakt</h2>
          <p className="mt-4 text-slate-500">
            Har din kommune spørsmål om å bli med, eller vil du vite mer om et konkret
            prosjekt? Vi hører gjerne fra deg.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="mailto:kontakt@kystloftet.no" className="btn-primary">
              Send e-post
            </Link>
            <Link href="/prosjekter" className="btn-secondary">
              Se prosjektene
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
