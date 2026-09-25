import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/routing";
import { SITE_NAME, SUPPORT_EMAIL, absoluteUrl, alternates, localePath } from "@/lib/site";

export const dynamic = "force-static";

const PATH = "/privacy";

const sectionIds = [
  "summary",
  "app",
  "website",
  "thirdParties",
  "children",
  "changes",
  "contact",
] as const;

const listSections = new Set<(typeof sectionIds)[number]>(["app", "website"]);

const storePolicies = [
  { key: "apple", href: "https://www.apple.com/legal/privacy/" },
  { key: "google", href: "https://policies.google.com/privacy" },
] as const;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "privacy.meta" });
  const url = absoluteUrl(locale, PATH);
  const images = [{ url: localePath(locale, "/opengraph-image"), width: 1200, height: 630, alt: SITE_NAME }];

  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: url, languages: alternates(PATH) },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url,
      locale,
      type: "website",
      siteName: SITE_NAME,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images,
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "privacy" });
  const updatedAt = t("updatedAt");
  const updatedAtLabel = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${updatedAt}T00:00:00Z`));

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
      <header className="border-b border-border pb-10">
        <p className="font-cinzel text-xs tracking-[0.35em] text-gold uppercase">{t("label")}</p>
        <h1 className="mt-4 font-cinzel text-3xl leading-tight text-text sm:text-4xl">{t("title")}</h1>
        <p className="mt-4 text-sm text-text-dim">
          {t("lastUpdated")}: <time dateTime={updatedAt}>{updatedAtLabel}</time>
        </p>
      </header>

      <nav aria-labelledby="privacy-toc" className="border-b border-border py-8">
        <h2 id="privacy-toc" className="font-cinzel text-xs tracking-[0.3em] text-text-dim uppercase">
          {t("tocLabel")}
        </h2>
        <ol className="mt-3 flex flex-wrap gap-x-6">
          {sectionIds.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="inline-flex min-h-11 items-center text-sm text-text-dim transition-colors hover:text-gold"
              >
                {t(`${id}.title`)}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-12 space-y-14">
        {sectionIds.map((id) => (
          <section key={id} id={id} aria-labelledby={`${id}-title`}>
            <h2 id={`${id}-title`} className="font-cinzel text-xl text-gold-light">
              {t(`${id}.title`)}
            </h2>

            {listSections.has(id) ? (
              <ul className="mt-5 space-y-4">
                {(t.raw(`${id}.items`) as string[]).map((item) => (
                  <li key={item} className="flex gap-4 leading-relaxed text-text-dim">
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-gold/60" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 leading-relaxed text-text-dim">{t(`${id}.body`)}</p>
            )}

            {id === "thirdParties" ? (
              <ul className="mt-4 flex flex-wrap gap-x-6">
                {storePolicies.map((policy) => (
                  <li key={policy.key}>
                    <a
                      href={policy.href}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="inline-flex min-h-11 items-center text-sm text-gold underline decoration-gold/40 underline-offset-4 transition-colors hover:text-gold-light"
                    >
                      {t(`thirdParties.${policy.key}`)}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}

            {id === "contact" ? (
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="mt-3 inline-flex min-h-11 items-center text-lg text-gold underline decoration-gold/40 underline-offset-4 transition-colors hover:text-gold-light"
              >
                {SUPPORT_EMAIL}
              </a>
            ) : null}
          </section>
        ))}
      </div>
    </article>
  );
}
