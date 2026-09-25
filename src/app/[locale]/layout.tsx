import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { Amiri, Cinzel, Outfit } from "next/font/google";
import AxeProvider from "@/components/providers/AxeProvider";
import VercelAnalytics from "@/components/providers/VercelAnalytics";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { locales } from "@/i18n/routing";
import {
  APP_STORE_ID,
  APP_STORE_URL,
  PLAY_STORE_URL,
  SITE_NAME,
  SITE_URL,
  SUPPORT_EMAIL,
  absoluteUrl,
  alternates,
  localePath,
} from "@/lib/site";

const amiri = Amiri({
  variable: "--ff-amiri",
  subsets: ["arabic"],
  weight: ["400"],
  style: ["normal"],
  display: "swap",
  preload: false,
});

const cinzel = Cinzel({
  variable: "--ff-cinzel",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--ff-outfit",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

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
  const t = await getTranslations({ locale, namespace: "common.meta" });
  const canonicalUrl = absoluteUrl(locale, "/");
  // Dosya tabanlı OG adresi varsayılan dilde /tr önekiyle üretilip yönlendirildiği için adres açıkça verilir.
  const images = [{ url: localePath(locale, "/opengraph-image"), width: 1200, height: 630, alt: SITE_NAME }];

  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    applicationName: SITE_NAME,
    alternates: {
      canonical: canonicalUrl,
      languages: alternates("/"),
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale,
      alternateLocale: locales.filter((l) => l !== locale),
      type: "website",
      url: canonicalUrl,
      siteName: SITE_NAME,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images,
    },
    ...(APP_STORE_ID ? { itunes: { appId: APP_STORE_ID } } : {}),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "common.meta" });

  const organizationId = `${SITE_URL}/#organization`;
  const storeApps = [
    { url: APP_STORE_URL, operatingSystem: "iOS" },
    { url: PLAY_STORE_URL, operatingSystem: "Android" },
  ].filter((app): app is { url: string; operatingSystem: string } => Boolean(app.url));

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/icon-512.png`,
        email: SUPPORT_EMAIL,
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
        publisher: { "@id": organizationId },
      })),
    ],
  };

  return (
    <html
      lang={locale}
      dir="ltr"
      className={`${amiri.variable} ${cinzel.variable} ${outfit.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <SiteHeader locale={locale} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={locale} />
        <AxeProvider />
        <VercelAnalytics />
      </body>
    </html>
  );
}
