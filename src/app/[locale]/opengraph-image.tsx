import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { defaultLocale, locales } from "@/i18n/routing";
import { SITE_NAME } from "@/lib/site";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const BACKGROUND = "#030305";
const GOLD = "#d4af37";
const TEXT_DIM = "#a8a095";

async function readAsset(path: string): Promise<Buffer | undefined> {
  try {
    return await readFile(join(process.cwd(), path));
  } catch {
    return undefined;
  }
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  const locale = hasLocale(locales, requested) ? requested : defaultLocale;
  const t = await getTranslations({ locale, namespace: "common.footer" });

  const [icon, cinzel, outfit] = await Promise.all([
    readAsset("public/icon-512.png"),
    readAsset("src/components/esma/fonts/Cinzel-SemiBold.ttf"),
    readAsset("src/components/esma/fonts/Outfit-Regular.ttf"),
  ]);

  // Font dosyaları okunamazsa next/og'nin varsayılan fontuyla üretilir.
  const fonts = [
    ...(cinzel ? [{ name: "Cinzel", data: cinzel, weight: 600 as const, style: "normal" as const }] : []),
    ...(outfit ? [{ name: "Outfit", data: outfit, weight: 400 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background: BACKGROUND,
        backgroundImage:
          "radial-gradient(circle at 50% 38%, rgba(212,175,55,0.16) 0%, rgba(3,3,5,0) 55%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 36,
          right: 36,
          bottom: 36,
          left: 36,
          display: "flex",
          border: "1px solid rgba(212,175,55,0.22)",
          borderRadius: 28,
        }}
      />

      {icon ? (
        <img
          src={`data:image/png;base64,${icon.toString("base64")}`}
          width={148}
          height={148}
          alt=""
          style={{ borderRadius: 32, marginBottom: 32 }}
        />
      ) : null}

      <div
        style={{
          display: "flex",
          fontFamily: "Cinzel",
          fontSize: 92,
          fontWeight: 600,
          letterSpacing: 14,
          color: GOLD,
          textTransform: "uppercase",
          lineHeight: 1,
        }}
      >
        {SITE_NAME}
      </div>

      <div
        style={{
          display: "flex",
          width: 96,
          height: 1,
          marginTop: 36,
          marginBottom: 32,
          background: "rgba(212,175,55,0.6)",
        }}
      />

      <div
        style={{
          display: "flex",
          fontFamily: "Outfit",
          fontSize: 36,
          color: TEXT_DIM,
          textAlign: "center",
          maxWidth: 900,
        }}
      >
        {t("tagline").replace(/\.$/, "")}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 70,
          display: "flex",
          fontFamily: "Outfit",
          fontSize: 22,
          letterSpacing: 4,
          color: TEXT_DIM,
        }}
      >
        iOS · Android
      </div>
    </div>,
    { ...size, fonts: fonts.length > 0 ? fonts : undefined },
  );
}
