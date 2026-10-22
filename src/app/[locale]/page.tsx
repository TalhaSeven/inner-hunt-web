import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import DailySection from "@/components/home/DailySection";
import DownloadSection from "@/components/home/DownloadSection";
import FaqSection from "@/components/home/FaqSection";
import HeroSection from "@/components/home/HeroSection";
import MoodsSection from "@/components/home/MoodsSection";
import NamesSection from "@/components/home/NamesSection";
import PrivacyStrip from "@/components/home/PrivacyStrip";
import ReminderSection from "@/components/home/ReminderSection";
import SourcesSection from "@/components/home/SourcesSection";
import { locales } from "@/i18n/routing";
import {
  APP_STORE_URL,
  OG_LOCALE,
  ORGANIZATION_ID,
  PLAY_STORE_URL,
  SITE_NAME,
  SITE_URL,
  WEBSITE_ID,
  absoluteUrl,
  alternates,
} from "@/lib/site";

export const dynamic = "force-static";

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
  const t = await getTranslations({ locale, namespace: "home.meta" });
  const url = absoluteUrl(locale, "/");

  return {
    title: { absolute: t("title") },
    description: t("description"),
    alternates: {
      canonical: url,
      languages: alternates("/"),
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url,
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      alternateLocale: locales.filter((item) => item !== locale).map((item) => OG_LOCALE[item]),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "common.meta" });
  const storeApps = [
    { url: APP_STORE_URL, operatingSystem: "iOS" },
    { url: PLAY_STORE_URL, operatingSystem: "Android" },
  ].filter((app): app is { url: string; operatingSystem: string } => Boolean(app.url));

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        inLanguage: locale,
        publisher: { "@id": ORGANIZATION_ID },
      },
      ...storeApps.map((app) => ({
        "@type": "MobileApplication",
        name: SITE_NAME,
        description: t("description"),
        operatingSystem: app.operatingSystem,
        applicationCategory: "LifestyleApplication",
        installUrl: app.url,
        inLanguage: [...locales],
        image: `${SITE_URL}/icon-512.png`,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        publisher: { "@id": ORGANIZATION_ID },
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <HeroSection locale={locale} />
      <DailySection locale={locale} />
      <MoodsSection locale={locale} />
      <NamesSection locale={locale} />
      <ReminderSection locale={locale} />
      <PrivacyStrip locale={locale} />
      <SourcesSection locale={locale} />
      <FaqSection locale={locale} />
      <DownloadSection locale={locale} />
    </>
  );
}
