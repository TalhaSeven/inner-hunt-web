import type { Metadata } from "next";
import Link from "next/link";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/routing";
import { SITE_NAME, SUPPORT_EMAIL, absoluteUrl, alternates, localePath } from "@/lib/site";

export const dynamic = "force-static";

const PATH = "/support";

const faqIds = [
  "reminderMissing",
  "changeTime",
  "changeLanguage",
  "dailyEsma",
  "dhikrCount",
  "translations",
  "whereData",
  "price",
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
  const t = await getTranslations({ locale, namespace: "support.meta" });
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

export default async function SupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "support" });
  const privacyHref = localePath(locale, "/privacy");

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: absoluteUrl(locale, PATH),
    inLanguage: locale,
    mainEntity: faqIds.map((id) => ({
      "@type": "Question",
      name: t(`faq.${id}.question`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t.markup(`faq.${id}.answer`, { privacy: (chunks) => chunks }),
      },
    })),
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />

      <header className="border-b border-border pb-10">
        <p className="font-cinzel text-xs tracking-[0.35em] text-gold uppercase">{t("label")}</p>
        <h1 className="mt-4 font-cinzel text-3xl leading-tight text-text sm:text-4xl">{t("title")}</h1>
        <p className="mt-5 max-w-2xl leading-relaxed text-text-dim">{t("intro")}</p>
      </header>

      <section aria-labelledby="faq-title" className="mt-12">
        <h2 id="faq-title" className="font-cinzel text-xl text-gold-light">
          {t("faqTitle")}
        </h2>
        <div className="mt-6 divide-y divide-border border-y border-border">
          {faqIds.map((id) => (
            <details key={id} id={id} className="group">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-text transition-colors hover:text-gold-light [&::-webkit-details-marker]:hidden">
                <span className="font-medium">{t(`faq.${id}.question`)}</span>
                <span
                  aria-hidden="true"
                  className="relative size-3 shrink-0 before:absolute before:top-1/2 before:left-0 before:h-px before:w-3 before:bg-gold after:absolute after:top-0 after:left-1/2 after:h-3 after:w-px after:bg-gold after:transition-transform group-open:after:scale-y-0"
                />
              </summary>
              <p className="pb-6 leading-relaxed text-text-dim">
                {t.rich(`faq.${id}.answer`, {
                  privacy: (chunks) => (
                    <Link
                      href={privacyHref}
                      className="text-gold underline decoration-gold/40 underline-offset-4 transition-colors hover:text-gold-light"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="contact-title"
        className="mt-16 rounded-2xl border border-gold/25 bg-bg-card px-6 py-8 sm:px-8"
      >
        <h2 id="contact-title" className="font-cinzel text-xl text-gold-light">
          {t("contact.title")}
        </h2>
        <p className="mt-4 leading-relaxed text-text-dim">{t("contact.body")}</p>
        <p className="mt-5 text-sm text-text-dim">
          <span className="sr-only">{t("contact.emailLabel")}: </span>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-flex min-h-11 items-center text-lg text-gold underline decoration-gold/40 underline-offset-4 transition-colors hover:text-gold-light"
          >
            {SUPPORT_EMAIL}
          </a>
        </p>
      </section>
    </article>
  );
}
