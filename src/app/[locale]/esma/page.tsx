import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import EsmaAppBox from "@/components/esma/EsmaAppBox";
import { locales } from "@/i18n/routing";
import { getAllEsma } from "@/lib/esma";
import { SITE_NAME, absoluteUrl, alternates, localePath } from "@/lib/site";

export const dynamic = "force-static";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "esma.meta" });
  const url = absoluteUrl(locale, "/esma");

  return {
    title: t("listTitle"),
    description: t("listDescription"),
    alternates: {
      canonical: url,
      languages: alternates("/esma"),
    },
    openGraph: {
      type: "website",
      url,
      title: t("listTitle"),
      description: t("listDescription"),
      siteName: SITE_NAME,
      locale,
      alternateLocale: locales.filter((l) => l !== locale),
    },
    twitter: {
      card: "summary_large_image",
      title: t("listTitle"),
      description: t("listDescription"),
    },
  };
}

export default async function EsmaListPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!hasLocale(locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "esma" });
  const names = getAllEsma(locale);

  return (
    <article className="mx-auto max-w-6xl px-4 pt-12 pb-20 sm:px-6 sm:pt-16">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-xs tracking-[0.4em] text-gold uppercase">{t("list.eyebrow")}</p>
        <h1 className="mt-4 font-cinzel text-4xl leading-tight font-semibold text-gold-light sm:text-5xl">
          {t("list.title")}
        </h1>
        <p className="mt-6 text-base leading-relaxed text-text-dim sm:text-lg">{t("list.intro")}</p>
        <p className="mt-3 text-sm text-text-dim">{t("list.order")}</p>
      </header>

      <ol
        aria-label={t("list.listLabel")}
        className="mt-14 grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {names.map((esma) => (
          <li key={esma.number}>
            <Link
              href={localePath(locale, `/esma/${esma.number}`)}
              className="group flex h-full flex-col border border-border bg-bg-card p-5 transition-colors hover:border-gold/40 hover:bg-gold/[0.03]"
            >
              <span className="flex items-start justify-between gap-4">
                <span className="text-xs tracking-[0.3em] text-gold uppercase">
                  {t("detail.label", { number: esma.number })}
                </span>
                <span
                  lang="ar"
                  dir="rtl"
                  className="font-amiri text-3xl leading-[1.6] text-white"
                >
                  {esma.arabic}
                </span>
              </span>
              <span className="mt-2 font-cinzel text-xl font-semibold text-gold-light transition-colors group-hover:text-gold">
                {esma.name}
              </span>
              <span className="mt-2 text-sm leading-relaxed text-text-dim">{esma.meaning}</span>
            </Link>
          </li>
        ))}
      </ol>

      <div className="mx-auto mt-20 max-w-2xl">
        <EsmaAppBox locale={locale} />
      </div>
    </article>
  );
}
