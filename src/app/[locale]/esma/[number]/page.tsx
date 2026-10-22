import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import EsmaAppBox from "@/components/esma/EsmaAppBox";
import EsmaSection from "@/components/esma/EsmaSection";
import { esmaCore } from "@/content/esma";
import moodsEn from "@/content/moods.en.json";
import moodsTr from "@/content/moods.tr.json";
import { moodById, type MoodId } from "@/content/moods";
import { locales, type Locale } from "@/i18n/routing";
import { getEsma, parseEsmaNumber, type Esma } from "@/lib/esma";
import { OG_LOCALE, ORGANIZATION_ID, SITE_NAME, SITE_URL, absoluteUrl, alternates, localePath } from "@/lib/site";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = Promise<{ locale: string; number: string }>;

const moodTexts: Record<Locale, Record<MoodId, { name: string; tags: string }>> = {
  tr: moodsTr,
  en: moodsEn,
};

export function generateStaticParams() {
  return esmaCore.map((esma) => ({ number: String(esma.number) }));
}

async function resolve(params: Params): Promise<{ locale: Locale; esma: Esma } | undefined> {
  const { locale, number } = await params;
  if (!hasLocale(locales, locale)) return undefined;
  const n = parseEsmaNumber(number);
  const esma = n === undefined ? undefined : getEsma(locale, n);
  return esma ? { locale, esma } : undefined;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const resolved = await resolve(params);
  if (!resolved) return {};
  const { locale, esma } = resolved;
  const t = await getTranslations({ locale, namespace: "esma.meta" });
  const path = `/esma/${esma.number}`;
  const title = t("detailTitle", { name: esma.name, arabic: esma.arabic });
  const url = absoluteUrl(locale, path);

  return {
    title,
    description: esma.meaning,
    alternates: {
      canonical: url,
      languages: alternates(path),
    },
    openGraph: {
      type: "website",
      url,
      title,
      description: esma.meaning,
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: esma.meaning,
    },
  };
}

export default async function EsmaDetailPage({ params }: { params: Params }) {
  const resolved = await resolve(params);
  if (!resolved) notFound();
  const { locale, esma } = resolved;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "esma.detail" });
  const previous = getEsma(locale, esma.number - 1);
  const next = getEsma(locale, esma.number + 1);
  const listHref = localePath(locale, "/esma");
  const url = absoluteUrl(locale, `/esma/${esma.number}`);

  const breadcrumbs = [
    { name: t("breadcrumbHome"), href: localePath(locale, "/"), item: absoluteUrl(locale, "/") },
    { name: t("breadcrumbList"), href: listHref, item: absoluteUrl(locale, "/esma") },
    { name: esma.name, href: undefined, item: url },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${esma.name} (${esma.arabic})`,
        description: esma.meaning,
        inLanguage: locale,
        url,
        mainEntityOfPage: url,
        image: `${SITE_URL}/${locale}/esma/${esma.number}/opengraph-image`,
        publisher: { "@id": ORGANIZATION_ID },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: crumb.name,
          item: crumb.item,
        })),
      },
    ],
  };

  const pager = [
    { key: "previous", esma: previous, label: t("previous"), rel: "prev", align: "items-start text-left" },
    { key: "next", esma: next, label: t("next"), rel: "next", align: "items-end text-right" },
  ] as const;

  return (
    <article className="mx-auto max-w-2xl px-4 pt-8 pb-20 sm:px-6 sm:pt-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <nav aria-label={t("breadcrumbLabel")}>
        <ol className="flex min-w-0 items-center gap-2 text-sm whitespace-nowrap text-text-dim">
          {breadcrumbs.map((crumb, i) => (
            <li key={crumb.item} className={`flex items-center gap-2 ${crumb.href ? "shrink-0" : "min-w-0"}`}>
              {i > 0 ? <span aria-hidden="true">›</span> : null}
              {crumb.href ? (
                <Link href={crumb.href} className="inline-flex min-h-11 items-center transition-colors hover:text-gold">
                  {crumb.name}
                </Link>
              ) : (
                <span aria-current="page" className="truncate text-text">
                  {crumb.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <header className="flex flex-col items-center pt-8 pb-12 text-center">
        <p className="text-xs tracking-[0.4em] text-gold uppercase">
          {t("label", { number: esma.number })}
        </p>
        <p
          lang="ar"
          dir="rtl"
          className="mt-4 font-amiri text-6xl leading-[1.9] text-white [text-shadow:0_0_24px_rgba(212,175,55,0.35)] sm:text-7xl"
        >
          {esma.arabic}
        </p>
        <h1 className="font-cinzel text-4xl leading-tight font-semibold text-gold-light sm:text-5xl">
          {esma.name}
        </h1>
        <div aria-hidden="true" className="my-7 flex items-center gap-4">
          <span className="h-px w-16 bg-gold/50" />
          <span className="size-2 rotate-45 bg-gold" />
          <span className="h-px w-16 bg-gold/50" />
        </div>
        <p className="max-w-xl text-lg leading-relaxed text-text sm:text-xl">{esma.meaning}</p>
      </header>

      <div className="flex flex-col gap-6">
        <EsmaSection id="description" title={t("descriptionTitle")}>
          <div className="space-y-4 text-[15px] leading-[1.8] text-text-dim">
            {esma.description.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </EsmaSection>

        <EsmaSection id="verses" title={t("versesTitle")}>
          <div className="space-y-8">
            {esma.verses.map((verse) => (
              <figure key={verse.ref} className="space-y-3">
                <blockquote className="border-l border-gold/40 pl-5 text-base leading-[1.8] text-text italic">
                  <p>{verse.text}</p>
                </blockquote>
                <figcaption className="pl-5 text-sm text-text-dim">
                  <cite className="font-medium text-gold not-italic">{verse.ref}</cite>
                  <span aria-hidden="true"> · </span>
                  <span className="sr-only">, </span>
                  {t("translationSource")}
                </figcaption>
              </figure>
            ))}
          </div>
        </EsmaSection>

        <EsmaSection id="reflection" title={t("reflectionTitle")}>
          <p className="text-[15px] leading-[1.8] text-text-dim">{esma.reflection}</p>
        </EsmaSection>

        <EsmaSection id="practice" title={t("practiceTitle")}>
          <p className="text-base leading-relaxed font-medium text-text">{esma.practice}</p>
        </EsmaSection>

        <dl className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border border-l-2 border-border border-l-gold bg-black/40 px-6 py-5">
          <dt className="text-xs font-medium tracking-[0.3em] text-text-dim uppercase">
            {t("dhikrLabel")}
          </dt>
          <dd className="col-start-2 row-span-2 row-start-1 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-white">{esma.dhikrCount}</span>
            <span className="text-sm text-text-dim">{t("dhikrUnit")}</span>
          </dd>
          <dd className="text-sm text-text-dim">{t("dhikrNote")}</dd>
        </dl>

        <section aria-labelledby="moods-title" className="pt-4">
          <h2
            id="moods-title"
            className="mb-4 text-xs font-medium tracking-[0.3em] text-gold uppercase"
          >
            {t("moodsTitle")}
          </h2>
          <ul className="flex flex-wrap gap-3">
            {esma.moods.map((id) => {
              const mood = moodById[id];
              return (
                <li
                  key={id}
                  className="inline-flex min-h-11 items-center gap-2 border border-border border-b-2 bg-bg-card px-4 text-sm text-text"
                  style={{ borderBottomColor: `${mood.accentColor}80` }}
                >
                  <span aria-hidden="true">{mood.emoji}</span>
                  {moodTexts[locale][id].name}
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <nav aria-label={t("pagerLabel")} className="mt-14 grid grid-cols-2 gap-4 border-t border-border pt-8">
        {pager.map((item) =>
          item.esma ? (
            <Link
              key={item.key}
              href={localePath(locale, `/esma/${item.esma.number}`)}
              rel={item.rel}
              className={`group flex min-h-11 flex-col gap-1 ${item.align} ${item.key === "next" ? "col-start-2" : ""}`}
            >
              <span className="text-xs tracking-[0.2em] text-text-dim uppercase">{item.label}</span>
              <span className="font-cinzel text-base text-gold-light transition-colors group-hover:text-gold sm:text-lg">
                {item.esma.name}
              </span>
            </Link>
          ) : null,
        )}
      </nav>

      <div className="mt-14">
        <EsmaAppBox locale={locale} />
      </div>
    </article>
  );
}
