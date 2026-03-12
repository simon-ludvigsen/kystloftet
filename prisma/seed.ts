import { PrismaClient, ProsjektStatus, ProsjektKategori, RessursType, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeder kjøres...");

  // Kommuner
  const kommuner = await Promise.all([
    prisma.kommune.upsert({
      where: { nummer: "1804" },
      update: {},
      create: {
        navn: "Bodø",
        nummer: "1804",
        fylke: "Nordland",
        befolkning: 53000,
        areal: 1387,
        kystlinje: 420,
        beskrivelse: "Nordlands største by og en viktig kystby i Nord-Norge.",
      },
    }),
    prisma.kommune.upsert({
      where: { nummer: "1860" },
      update: {},
      create: {
        navn: "Vestvågøy",
        nummer: "1860",
        fylke: "Nordland",
        befolkning: 11000,
        areal: 411,
        kystlinje: 280,
        beskrivelse: "Lofotens største kommune med rik fiskerhistorie.",
      },
    }),
    prisma.kommune.upsert({
      where: { nummer: "5401" },
      update: {},
      create: {
        navn: "Tromsø",
        nummer: "5401",
        fylke: "Troms og Finnmark",
        befolkning: 78000,
        areal: 2521,
        kystlinje: 530,
        beskrivelse: "Nordens Paris – porten til Arktis.",
      },
    }),
    prisma.kommune.upsert({
      where: { nummer: "1511" },
      update: {},
      create: {
        navn: "Vanylven",
        nummer: "1511",
        fylke: "Møre og Romsdal",
        befolkning: 3500,
        areal: 580,
        kystlinje: 180,
        beskrivelse: "Kystkommunen innerst i Sunnfjord.",
      },
    }),
  ]);

  // Tags
  const tags = await Promise.all(
    ["bærekraft", "fiskeri", "reiseliv", "infrastruktur", "ungdom", "digitalisering", "klima"].map(
      (navn) => prisma.tag.upsert({ where: { navn }, update: {}, create: { navn } })
    )
  );

  // Prosjekter
  const prosjekt1 = await prisma.prosjekt.upsert({
    where: { slug: "digital-kystsamfunn-2025" },
    update: {},
    create: {
      tittel: "Digitalt kystsamfunn 2025",
      slug: "digital-kystsamfunn-2025",
      beskrivelse:
        "Et samarbeidsprosjekt for å styrke digital infrastruktur og kompetanse i kystkommuner langs hele norskekysten. Prosjektet vil etablere felles læringsplattformer, tilby kurs i digital forretningsutvikling, og bygge nettverk mellom lokale bedrifter og kommunale tjenester.",
      status: ProsjektStatus.AKTIV,
      kategori: ProsjektKategori.KOMPETANSE,
      budsjett: 4500000,
      startDato: new Date("2025-01-15"),
      sluttDato: new Date("2026-06-30"),
      kommuner: {
        create: [
          { kommuneId: kommuner[0].id, rolle: "Lederkommune" },
          { kommuneId: kommuner[2].id, rolle: "Samarbeidspartner" },
        ],
      },
      milestones: {
        create: [
          {
            tittel: "Behovsanalyse fullført",
            beskrivelse: "Kartlegging av digitale behov i alle deltakerkommuner",
            forfallsDato: new Date("2025-03-31"),
            fullfort: true,
            fullfortDato: new Date("2025-03-28"),
          },
          {
            tittel: "Læringsplattform lansert",
            beskrivelse: "Felles digital plattform for kursing og kompetansebygging",
            forfallsDato: new Date("2025-08-31"),
            fullfort: false,
          },
          {
            tittel: "Pilotfase avsluttet",
            beskrivelse: "Evaluering av pilotfase med 3 kommuner",
            forfallsDato: new Date("2026-01-31"),
            fullfort: false,
          },
        ],
      },
      tags: {
        create: [
          { tagId: tags[5].id }, // digitalisering
          { tagId: tags[0].id }, // bærekraft
        ],
      },
    },
  });

  const prosjekt2 = await prisma.prosjekt.upsert({
    where: { slug: "lofoten-blaa-vei" },
    update: {},
    create: {
      tittel: "Lofoten – Blå vei",
      slug: "lofoten-blaa-vei",
      beskrivelse:
        "Utvikling av en helhetlig kysturismeroute gjennom Lofoten med fokus på bærekraftig reiseliv, lokale opplevelser og marin kultur. Prosjektet kombinerer båttransport, havneoppgraderinger og lokale aktivitetstilbud.",
      status: ProsjektStatus.AKTIV,
      kategori: ProsjektKategori.REISELIV,
      budsjett: 7200000,
      startDato: new Date("2024-09-01"),
      sluttDato: new Date("2027-08-31"),
      kommuner: {
        create: [
          { kommuneId: kommuner[1].id, rolle: "Lederkommune" },
        ],
      },
      milestones: {
        create: [
          {
            tittel: "Ruteplan utarbeidet",
            forfallsDato: new Date("2024-12-01"),
            fullfort: true,
            fullfortDato: new Date("2024-11-25"),
          },
          {
            tittel: "Havneopprustning Stamsund",
            forfallsDato: new Date("2025-06-01"),
            fullfort: false,
          },
        ],
      },
      tags: {
        create: [
          { tagId: tags[2].id }, // reiseliv
          { tagId: tags[0].id }, // bærekraft
          { tagId: tags[6].id }, // klima
        ],
      },
    },
  });

  await prisma.prosjekt.upsert({
    where: { slug: "ungdom-til-kysten" },
    update: {},
    create: {
      tittel: "Ungdom til kysten",
      slug: "ungdom-til-kysten",
      beskrivelse:
        "Rekrutteringsprosjekt rettet mot unge mellom 18 og 35 år for å styrke tilflytting og bosetting i kystkommuner. Inkluderer mentorordninger, tilskudd til etablering og nettverksbygging.",
      status: ProsjektStatus.PLANLAGT,
      kategori: ProsjektKategori.NAERING,
      budsjett: 2100000,
      startDato: new Date("2025-09-01"),
      sluttDato: new Date("2027-12-31"),
      kommuner: {
        create: [
          { kommuneId: kommuner[3].id, rolle: "Lederkommune" },
          { kommuneId: kommuner[0].id, rolle: "Samarbeidspartner" },
          { kommuneId: kommuner[1].id, rolle: "Samarbeidspartner" },
        ],
      },
      tags: {
        create: [
          { tagId: tags[4].id }, // ungdom
          { tagId: tags[0].id }, // bærekraft
        ],
      },
    },
  });

  // Ressurser
  await Promise.all([
    prisma.ressurs.upsert({
      where: { id: "res-001" },
      update: {},
      create: {
        id: "res-001",
        tittel: "Veileder for kystkommunesamarbeid",
        beskrivelse: "En praktisk veileder for kommuner som ønsker å etablere interkommunalt samarbeid.",
        type: RessursType.VEILEDNING,
        url: "https://www.regjeringen.no/kystsamarbeid",
      },
    }),
    prisma.ressurs.upsert({
      where: { id: "res-002" },
      update: {},
      create: {
        id: "res-002",
        tittel: "Mal for prosjektsøknad – Interreg",
        beskrivelse: "Standardmal for søknad om Interreg-midler til kystutviklingsprosjekter.",
        type: RessursType.MAL,
        url: "/ressurser/interreg-mal.docx",
      },
    }),
    prisma.ressurs.upsert({
      where: { id: "res-003" },
      update: {},
      create: {
        id: "res-003",
        tittel: "Rapport: Kystøkonomi 2024",
        beskrivelse: "Årsrapport om økonomi og sysselsetting i norske kystkommuner.",
        type: RessursType.RAPPORT,
        url: "/ressurser/kystoekonomi-2024.pdf",
      },
    }),
  ]);

  console.log("Seeding fullført!");
  console.log(`  ${kommuner.length} kommuner`);
  console.log("  3 prosjekter");
  console.log("  3 ressurser");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
