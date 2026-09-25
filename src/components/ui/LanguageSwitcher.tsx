"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

// next-intl, "/" isteğinde bu çereze bakarak yönlendirir; seçilen dil kalıcı olsun.
function rememberLocale(locale: Locale) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; samesite=lax`;
}

export default function LanguageSwitcher({ locale, label, names }: Props) {
  const path = stripLocale(usePathname() ?? "/");

  return (
    <nav aria-label={label} className="flex items-center gap-1 text-xs">
      {locales.map((code) => {
        const active = code === locale;
        return (
          <Link
            key={code}
            href={withLocale(code, path)}
            hrefLang={code}
            lang={code}
            prefetch={false}
            onClick={() => rememberLocale(code)}
            aria-current={active ? "true" : undefined}
            aria-label={names[code]}
            className={`inline-flex min-h-11 min-w-11 items-center justify-center px-2 font-cinzel tracking-[0.2em] uppercase transition-colors ${
              active ? "text-gold" : "text-text-dim hover:text-text"
            }`}
          >
            {code}
          </Link>
        );
      })}
    </nav>
  );
}
