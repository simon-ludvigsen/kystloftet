# Kystløftet

Nasjonal plattform for samarbeid mellom norske kystkommuner – prosjekter, kunnskapsdeling og ressurser for en sterkere kyst.

## Teknisk arkitektur

```
kystloftet/
├── prisma/
│   ├── schema.prisma          # Databasemodeller (PostgreSQL)
│   └── seed.ts                # Testdata
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # Root-layout med header/footer
│   │   ├── page.tsx           # Forside
│   │   ├── not-found.tsx      # 404-side
│   │   ├── api/               # REST API-ruter (backend)
│   │   │   ├── auth/[...nextauth]/  # NextAuth.js
│   │   │   ├── prosjekter/    # GET/POST prosjekter
│   │   │   │   └── [slug]/   # GET/PATCH/DELETE enkelt prosjekt
│   │   │   ├── kommuner/      # GET kommuner
│   │   │   │   └── [id]/     # GET enkelt kommune
│   │   │   ├── ressurser/     # GET/POST ressurser
│   │   │   └── statistikk/    # GET aggregerte tall
│   │   ├── prosjekter/        # Prosjektsider
│   │   │   ├── page.tsx       # Prosjektliste med filtrering
│   │   │   └── [slug]/page.tsx# Prosjektdetaljer + milepæler
│   │   ├── kommuner/          # Kommunesider
│   │   │   ├── page.tsx       # Kommuneoversikt (gruppert etter fylke)
│   │   │   └── [id]/page.tsx  # Kommunedetaljer
│   │   ├── ressurser/page.tsx # Ressursbibliotek
│   │   ├── statistikk/page.tsx# Nøkkeltall og grafer
│   │   ├── om-oss/page.tsx    # Om Kystløftet
│   │   └── logg-inn/page.tsx  # Innlogging (GitHub OAuth)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx     # Navigasjonstopp
│   │   │   └── Footer.tsx     # Bunntekst
│   │   ├── prosjekter/
│   │   │   ├── ProsjektKort.tsx    # Prosjektkort for liste
│   │   │   └── ProsjektFilter.tsx  # Status/kategori-filtrering
│   │   └── StatistikkKort.tsx # Tallvisning
│   ├── lib/
│   │   ├── prisma.ts          # Prisma-klient (singleton)
│   │   ├── auth.ts            # NextAuth.js-konfigurasjon
│   │   └── utils.ts           # Hjelpefunksjoner
│   └── types/
│       └── index.ts           # TypeScript-typer med relasjoner
```

## Domenemodeller

| Modell | Beskrivelse |
|--------|-------------|
| `Kommune` | Norsk kystkommune med geografidata |
| `Prosjekt` | Samarbeidsprosjekt med status, kategori og budsjett |
| `Milestone` | Fremdriftsmilepæler for hvert prosjekt |
| `User` | Brukere med roller (Admin / Koordinator / Bidragsyter / Gjest) |
| `Innlegg` | Prosjektoppdateringer og bloggposter |
| `Ressurs` | Delte dokumenter, maler og rapporter |
| `Tag` | Emneknagger for prosjekter |

## Kom i gang

### Krav

- Node.js 20+
- PostgreSQL 15+

### Installasjon

```bash
# Installer avhengigheter
npm install

# Kopier miljøvariabler
cp .env.example .env
# Fyll inn DATABASE_URL og AUTH-verdier i .env

# Generer Prisma-klient og push schema
npm run db:push

# Fyll inn testdata
npm run db:seed

# Start dev-server
npm run dev
```

Applikasjonen kjører på [http://localhost:3000](http://localhost:3000).

### Viktige kommandoer

```bash
npm run dev          # Start utviklingsserver
npm run build        # Produksjonsbygg
npm run db:studio    # Åpne Prisma Studio (databasevisning)
npm run db:migrate   # Kjør databasemigrasjoner
npm run db:seed      # Last inn testdata
```

## API-endepunkter

| Metode | Endepunkt | Beskrivelse |
|--------|-----------|-------------|
| `GET` | `/api/prosjekter` | Hent prosjekter (støtter ?status=, ?kategori=, ?side=) |
| `POST` | `/api/prosjekter` | Opprett nytt prosjekt (krever Koordinator/Admin) |
| `GET` | `/api/prosjekter/:slug` | Hent prosjektdetaljer |
| `PATCH` | `/api/prosjekter/:slug` | Oppdater prosjekt |
| `DELETE` | `/api/prosjekter/:slug` | Slett prosjekt (kun Admin) |
| `GET` | `/api/kommuner` | Hent alle kommuner (støtter ?fylke=, ?sok=) |
| `GET` | `/api/kommuner/:id` | Hent kommunedetaljer med prosjekter |
| `GET` | `/api/ressurser` | Hent ressurser |
| `POST` | `/api/ressurser` | Legg til ressurs |
| `GET` | `/api/statistikk` | Aggregerte nøkkeltall |

## Teknologivalg

| Teknologi | Rolle |
|-----------|-------|
| [Next.js 15](https://nextjs.org) | Fullstack-rammeverk (App Router) |
| [TypeScript](https://typescriptlang.org) | Typesikkerhet |
| [Prisma](https://prisma.io) | ORM og databasemigrasjoner |
| [PostgreSQL](https://postgresql.org) | Hoveddatabase |
| [NextAuth.js v5](https://authjs.dev) | Autentisering (GitHub OAuth) |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [Zod](https://zod.dev) | Skjemavalidering i API-ruter |
