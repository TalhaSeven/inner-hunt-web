import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { locales, type Locale } from "@/i18n/routing";
import { SITE_NAME, localePath } from "@/lib/site";

export default async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "common.nav" });
  const tLang = await getTranslations({ locale, namespace: "common.langSwitcher" });
  const home = localePath(locale, "/");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-bg focus:px-3 focus:py-2 focus:text-gold"
      >
        {t("skipToContent")}
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href={home}
          aria-label={t("home")}
          className="flex min-h-11 items-center gap-3"
        >
          <Image
            src="/icon-192.png"
            alt=""
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="font-cinzel text-sm tracking-[0.25em] whitespace-nowrap text-text uppercase max-[399px]:sr-only sm:text-base">
            {SITE_NAME}
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageSwitcher
            locale={locale}
            label={tLang("label")}
            names={Object.fromEntries(locales.map((code) => [code, tLang(code)])) as Record<Locale, string>}
          />
          <a
            href={`${home}#download`}
            className="inline-flex min-h-11 items-center border border-gold/40 bg-gold/5 px-4 font-cinzel text-xs font-semibold tracking-[0.2em] text-gold-light uppercase transition-colors hover:border-gold hover:bg-gold/15"
          >
            {t("download")}
          </a>
        </div>
      </div>
    </header>
  );
}
