import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/site";

const BADGE_HEIGHT = 40;

// Google rozetinin PNG'sinde dile göre değişen boşluk var; görünür alan Apple rozetiyle aynı yüksekliğe getirilir.
const googleBadges: Record<Locale, { box: [number, number, number, number]; size: [number, number] }> = {
  tr: { box: [0, 29, 646, 192], size: [646, 250] },
  en: { box: [41, 41, 564, 168], size: [646, 250] },
};

const appleBadges: Record<Locale, { width: number; height: number }> = {
  tr: { width: 151.29, height: 40 },
  en: { width: 119.66, height: 40 },
};

type Props = {
  locale: Locale;
  className?: string;
  align?: "start" | "center";
};

export default async function StoreBadges({ locale, className = "", align = "start" }: Props) {
  const t = await getTranslations({ locale, namespace: "common.badges" });

  const apple = appleBadges[locale];
  const google = googleBadges[locale];
  const scale = BADGE_HEIGHT / google.box[3];
  const googleWidth = Math.round(google.box[2] * scale);

  const badges = [
    {
      key: "app-store",
      url: APP_STORE_URL,
      label: t("appStore"),
      width: Math.round(apple.width),
      image: (
        <Image
          src={`/badges/app-store-${locale}.svg`}
          alt=""
          width={Math.round(apple.width)}
          height={BADGE_HEIGHT}
          unoptimized
          className="block h-10 w-auto"
        />
      ),
    },
    {
      key: "google-play",
      url: PLAY_STORE_URL,
      label: t("googlePlay"),
      width: googleWidth,
      image: (
        <span
          className="relative block overflow-hidden"
          style={{ width: googleWidth, height: BADGE_HEIGHT }}
        >
          <Image
            src={`/badges/google-play-${locale}.png`}
            alt=""
            width={Math.round(google.size[0] * scale)}
            height={Math.round(google.size[1] * scale)}
            className="absolute max-w-none"
            style={{ left: -google.box[0] * scale, top: -google.box[1] * scale }}
          />
        </span>
      ),
    },
  ];

  return (
    <ul
      aria-label={t("groupLabel")}
      className={`flex flex-wrap gap-4 ${align === "center" ? "justify-center" : ""} ${className}`}
    >
      {badges.map((badge) => (
        <li key={badge.key} className="flex flex-col items-center gap-2">
          {badge.url ? (
            <a
              href={badge.url}
              rel="noopener"
              aria-label={badge.label}
              className="block rounded-lg transition-opacity hover:opacity-85"
            >
              {badge.image}
            </a>
          ) : (
            <>
              <span
                role="img"
                aria-label={t("comingSoonLabel", { store: badge.label })}
                className="block opacity-40 grayscale"
              >
                {badge.image}
              </span>
              <span
                aria-hidden="true"
                className="font-cinzel text-[11px] tracking-[0.3em] text-gold uppercase"
              >
                {t("comingSoon")}
              </span>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
