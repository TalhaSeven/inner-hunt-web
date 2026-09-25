import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { esmaCore } from "@/content/esma";
import { locales } from "@/i18n/routing";
import { getEsma, parseEsmaNumber } from "@/lib/esma";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontDir = join(process.cwd(), "src/components/esma/fonts");

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    esmaCore.map((esma) => ({ locale, number: String(esma.number) })),
  );
}

function nameFontSize(name: string): number {
  if (name.length <= 12) return 96;
  if (name.length <= 16) return 80;
  return 64;
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; number: string }>;
}) {
  const { locale, number } = await params;
  if (!hasLocale(locales, locale)) notFound();
  const n = parseEsmaNumber(number);
  const esma = n === undefined ? undefined : getEsma(locale, n);
  if (!esma) notFound();

  const [t, cinzel, outfit] = await Promise.all([
    getTranslations({ locale, namespace: "esma.detail" }),
    readFile(join(fontDir, "Cinzel-SemiBold.ttf")),
    readFile(join(fontDir, "Outfit-Regular.ttf")),
  ]);

  const corner = { position: "absolute" as const, width: 20, height: 20, borderColor: "#d4af37", borderStyle: "solid" as const };

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#030305",
        backgroundImage:
          "radial-gradient(circle at 50% 38%, rgba(212,175,55,0.16) 0%, rgba(3,3,5,0) 60%)",
        padding: 40,
      }}
    >
      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(212,175,55,0.25)",
          padding: "0 80px",
        }}
      >
        <div style={{ ...corner, top: -1, left: -1, borderTopWidth: 2, borderLeftWidth: 2 }} />
        <div style={{ ...corner, top: -1, right: -1, borderTopWidth: 2, borderRightWidth: 2 }} />
        <div style={{ ...corner, bottom: -1, left: -1, borderBottomWidth: 2, borderLeftWidth: 2 }} />
        <div style={{ ...corner, bottom: -1, right: -1, borderBottomWidth: 2, borderRightWidth: 2 }} />

        <div
          style={{
            fontFamily: "Cinzel",
            fontSize: 26,
            letterSpacing: 8,
            color: "#d4af37",
          }}
        >
          {t("label", { number: esma.number })}
        </div>
        <div
          style={{
            marginTop: 28,
            fontFamily: "Cinzel",
            fontSize: nameFontSize(esma.name),
            lineHeight: 1.15,
            color: "#f3e5ab",
            textAlign: "center",
          }}
        >
          {esma.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 36, marginBottom: 36 }}>
          <div style={{ width: 96, height: 1, background: "rgba(212,175,55,0.5)" }} />
          <div
            style={{
              width: 10,
              height: 10,
              margin: "0 20px",
              background: "#d4af37",
              transform: "rotate(45deg)",
            }}
          />
          <div style={{ width: 96, height: 1, background: "rgba(212,175,55,0.5)" }} />
        </div>
        <div
          style={{
            fontFamily: "Outfit",
            fontSize: 34,
            lineHeight: 1.45,
            color: "#fdfbf7",
            textAlign: "center",
            maxWidth: 920,
          }}
        >
          {esma.meaning}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 36,
            fontFamily: "Cinzel",
            fontSize: 22,
            letterSpacing: 6,
            color: "#aa8529",
          }}
        >
          innerhunt.com
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Cinzel", data: cinzel, weight: 600, style: "normal" },
        { name: "Outfit", data: outfit, weight: 400, style: "normal" },
      ],
    },
  );
}
