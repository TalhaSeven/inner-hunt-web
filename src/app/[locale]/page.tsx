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
import { SITE_NAME, absoluteUrl, alternates } from "@/lib/site";

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
    title: t("title"),
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
      locale,
      alternateLocale: locales.filter((item) => item !== locale),
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

  return (
    <>
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
