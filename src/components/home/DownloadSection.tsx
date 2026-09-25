import Image from "next/image";
import { getTranslations } from "next-intl/server";
import StoreBadges from "@/components/site/StoreBadges";
import type { Locale } from "@/i18n/routing";
import SectionHeading from "./SectionHeading";
import styles from "./home.module.css";

export default async function DownloadSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.download" });

  return (
    <section id="download" aria-labelledby="download-title" className="relative overflow-hidden border-t border-border">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[640px] max-w-[160%] -translate-x-1/2 -translate-y-1/2 rounded-full ${styles.glow}`}
      />
      <div className={`${styles.reveal} relative mx-auto flex max-w-3xl flex-col items-center gap-8 px-4 py-24 text-center sm:px-6 sm:py-32`}>
        <Image src="/icon-192.png" alt="" width={72} height={72} className="rounded-2xl shadow-[0_0_40px_rgba(212,175,55,0.25)]" />
        <SectionHeading id="download-title" eyebrow={t("eyebrow")} title={t("title")} align="center">
          <p className="max-w-xl leading-relaxed text-text-dim">{t("body")}</p>
        </SectionHeading>
        <StoreBadges locale={locale} align="center" />
      </div>
    </section>
  );
}
