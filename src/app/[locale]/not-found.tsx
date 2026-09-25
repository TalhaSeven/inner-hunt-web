import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { defaultLocale, locales } from "@/i18n/routing";
import { localePath } from "@/lib/site";

export default async function NotFound() {
  const requested = await getLocale();
  const locale = hasLocale(locales, requested) ? requested : defaultLocale;
  const t = await getTranslations({ locale, namespace: "notFound" });

  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-xl flex-col items-center justify-center gap-5 px-4 py-24 text-center">
      <p className="font-cinzel text-xs tracking-[0.4em] text-gold uppercase">404</p>
      <h1 className="font-cinzel text-3xl text-text">{t("title")}</h1>
      <p className="text-text-dim">{t("description")}</p>
      <Link
        href={localePath(locale, "/")}
        className="inline-flex min-h-11 items-center text-sm text-gold underline underline-offset-4 hover:text-gold-light"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
