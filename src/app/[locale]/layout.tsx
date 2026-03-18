import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { Amiri, Cinzel, Outfit } from "next/font/google";
import AxeProvider from "@/components/providers/AxeProvider";
import VercelAnalytics from "@/components/providers/VercelAnalytics";

const locales = ["tr", "en", "de", "es"] as const;
const gaId = "G-Q1QYB1VHRP";

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400"],
  style: ["normal"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const baseUrl = "https://innerhunt.com";
  const canonicalUrl = locale === "tr" ? baseUrl : `${baseUrl}/${locale}`;

  return {
    metadataBase: new URL(baseUrl),
    title: t("title"),
    description: t("description"),
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "Inner Hunt",
    },
    icons: {
      apple: "/apple-touch-icon.png",
    },
    alternates: {
      canonical: locale === "tr" ? baseUrl : `${baseUrl}/${locale}`,
      languages: {
        tr: baseUrl,
        en: `${baseUrl}/en`,
        de: `${baseUrl}/de`,
        es: `${baseUrl}/es`,
        "x-default": baseUrl,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale,
      alternateLocale: locales.filter((l) => l !== locale),
      type: "website",
      url: canonicalUrl,
      siteName: "Inner Hunt",
      images: [{ url: `${baseUrl}/${locale}/opengraph-image` }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${baseUrl}/${locale}/opengraph-image`],
    },
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

  const t = await getTranslations({ locale, namespace: "meta" });
  const baseUrl = "https://innerhunt.com";
  const canonicalUrl = locale === "tr" ? baseUrl : `${baseUrl}/${locale}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("title"),
    description: t("description"),
    url: canonicalUrl,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "All",
    inLanguage: locale,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: "Inner Hunt",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/icon-512.png`,
      },
    },
    image: `${baseUrl}/icon-512.png`,
    screenshot: `${baseUrl}/opengraph-image`,
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <AxeProvider />
        <VercelAnalytics />
        <GoogleAnalytics gaId={gaId} />
      </body>
    </html>
  );
}
