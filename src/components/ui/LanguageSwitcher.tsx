"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { defaultLocale, locales, type Locale } from "@/i18n/routing";

type Props = {
  locale: Locale;
  label: string;
  names: Record<Locale, string>;
};

function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  if (locales.includes(first as Locale)) return `/${rest.join("/")}`;
  return pathname;
}

function withLocale(locale: Locale, path: string): string {
  if (locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export default function LanguageSwitcher({ locale, label, names }: Props) {
  const path = stripLocale(usePathname() ?? "/");
  const detailsRef = useRef<HTMLDetailsElement>(null);

  // Menü <details> ile açılır; linkler kapalıyken de HTML'de kalır. Dışarı tıklama ve Escape menüyü kapatır.
  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;

    function onPointerDown(event: PointerEvent) {
      if (details!.open && !details!.contains(event.target as Node)) details!.open = false;
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || !details!.open) return;
      details!.open = false;
      details!.querySelector("summary")?.focus();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <nav aria-label={label} className="text-xs">
      <details ref={detailsRef} className="group relative">
        <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 px-2 font-cinzel tracking-[0.2em] text-text-dim uppercase transition-colors select-none hover:text-text max-[399px]:tracking-normal [&::-webkit-details-marker]:hidden">
          <span className="sr-only">{label}: </span>
          <span lang={locale}>{names[locale]}</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 10 6"
            className="size-2.5 transition-transform group-open:rotate-180"
          >
            <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </summary>
        <ul className="absolute right-0 top-full z-50 mt-1 min-w-36 border border-border bg-bg py-1 shadow-lg shadow-black/60">
          {locales.map((code) => {
            const active = code === locale;
            return (
              <li key={code}>
                <Link
                  href={withLocale(code, path)}
                  hrefLang={code}
                  lang={code}
                  prefetch={false}
                  aria-current={active ? "true" : undefined}
                  onClick={() => {
                    if (detailsRef.current) detailsRef.current.open = false;
                  }}
                  className={`flex min-h-11 items-center px-4 font-cinzel tracking-[0.2em] uppercase transition-colors hover:bg-gold/10 ${
                    active ? "text-gold" : "text-text-dim hover:text-text"
                  }`}
                >
                  {names[code]}
                </Link>
              </li>
            );
          })}
        </ul>
      </details>
    </nav>
  );
}
