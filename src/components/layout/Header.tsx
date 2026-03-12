"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/prosjekter", label: "Prosjekter" },
  { href: "/kommuner", label: "Kommuner" },
  { href: "/ressurser", label: "Ressurser" },
  { href: "/om-oss", label: "Om Kystløftet" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="container-kyst flex h-16 items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-hav-800">
          <WaveIcon className="h-7 w-7 text-hav-600" />
          <span className="text-lg tracking-tight">Kystløftet</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                pathname.startsWith(href)
                  ? "bg-hav-50 text-hav-800"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link href="/logg-inn" className="btn-secondary hidden sm:inline-flex">
            Logg inn
          </Link>
          <Link href="/prosjekter/nytt" className="btn-primary">
            Nytt prosjekt
          </Link>
        </div>
      </div>
    </header>
  );
}

function WaveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 20C5.5 16 9.5 16 13 20C16.5 24 20.5 24 24 20C27.5 16 30 16 30 16"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M2 13C5.5 9 9.5 9 13 13C16.5 17 20.5 17 24 13C27.5 9 30 9 30 9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity="0.5"
      />
    </svg>
  );
}
