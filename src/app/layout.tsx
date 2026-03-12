import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kystløftet",
    template: "%s | Kystløftet",
  },
  description:
    "En nasjonal plattform for samarbeid mellom kystkommuner – prosjekter, kunnskapsdeling og ressurser for en sterkere kyst.",
  keywords: ["kystkommune", "kystnæring", "havbruk", "reiseliv", "samarbeid", "norge"],
  openGraph: {
    type: "website",
    locale: "nb_NO",
    siteName: "Kystløftet",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} flex min-h-full flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
