import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { ESMA_PAGES_ENABLED, SITE_NAME, SUPPORT_EMAIL, localePath } from "@/lib/site";

export default async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "common.footer" });

  const links = [
    { href: localePath(locale, "/privacy"), label: t("privacy") },
    { href: localePath(locale, "/support"), label: t("support") },
    ...(ESMA_PAGES_ENABLED ? [{ href: localePath(locale, "/esma"), label: t("esma") }] : []),
  ];

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="font-cinzel text-base tracking-[0.25em] text-text uppercase">{SITE_NAME}</p>
            <p className="text-sm text-text-dim">{t("tagline")}</p>
          </div>
          <nav aria-label={t("linksLabel")}>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-text-dim transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="inline-flex min-h-11 items-center text-text-dim transition-colors hover:text-gold"
                >
                  <span className="sr-only">{t("contact")}: </span>
                  {SUPPORT_EMAIL}
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="space-y-1 border-t border-border pt-6 text-xs leading-relaxed text-text-dim">
          <p>{t("trademarkApple")}</p>
          <p>{t("trademarkGoogle")}</p>
        </div>
      </div>
    </footer>
  );
}
