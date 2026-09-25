import { getTranslations } from "next-intl/server";
import StoreBadges from "@/components/site/StoreBadges";
import type { Locale } from "@/i18n/routing";
import PhoneFrame, { getScreen } from "./PhoneFrame";
import styles from "./home.module.css";

export default async function HeroSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.hero" });

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/30 to-transparent"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-14 pb-20 sm:px-6 sm:pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:pt-24 lg:pb-28">
        <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <p className="font-cinzel text-xs font-semibold tracking-[0.3em] text-gold uppercase">
            {t("eyebrow")}
          </p>
          <h1
            id="hero-title"
            className="max-w-2xl font-cinzel text-[1.85rem] leading-[1.15] text-balance text-text min-[400px]:text-4xl sm:text-5xl lg:text-[3.5rem]"
          >
            {t("title")}
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-pretty text-text-dim sm:text-lg">
            {t("subtitle")}
          </p>
          <StoreBadges locale={locale} className="mt-2 justify-center lg:justify-start" />
          <p className="text-sm tracking-wide text-text-dim">{t("note")}</p>
        </div>
        <div className="relative flex justify-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[130%] max-w-[560px] -translate-x-1/2 -translate-y-1/2"
          >
            <div className={`size-full rounded-full ${styles.glow} ${styles.breathe}`} />
          </div>
          <PhoneFrame
            screen={getScreen(locale, "bugun")}
            alt={t("imageAlt")}
            sizes="(min-width: 1024px) 300px, (min-width: 640px) 280px, 240px"
            priority
            className={`relative w-[240px] sm:w-[280px] lg:w-[300px] ${styles.float}`}
          />
        </div>
      </div>
    </section>
  );
}
