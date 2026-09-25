import Image from "next/image";
import { getTranslations } from "next-intl/server";
import esmaEn from "@/content/esma.en.json";
import esmaTr from "@/content/esma.tr.json";
import type { Locale } from "@/i18n/routing";
import { SITE_NAME } from "@/lib/site";
import SectionHeading from "./SectionHeading";
import styles from "./home.module.css";

const sampleEsma: Record<Locale, { name: string; meaning: string }> = {
  tr: esmaTr["1"],
  en: esmaEn["1"],
};

export default async function ReminderSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.reminder" });
  const sample = sampleEsma[locale];

  return (
    <section aria-labelledby="reminder-title" className="border-t border-border">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:gap-16">
        <div className={styles.reveal}>
          <SectionHeading id="reminder-title" eyebrow={t("eyebrow")} title={t("title")}>
            <p className="max-w-xl leading-relaxed text-text-dim">{t("body")}</p>
            <p className="max-w-xl leading-relaxed text-text-dim">{t("local")}</p>
          </SectionHeading>
        </div>
        <figure
          className={`${styles.corners} ${styles.reveal} mx-auto flex w-full max-w-md flex-col items-center gap-8 px-5 py-10 sm:px-10 sm:py-14`}
        >
          <figcaption className="font-cinzel text-xs font-semibold tracking-[0.3em] text-text-dim uppercase">
            {t("notificationLabel")}
          </figcaption>
          <p aria-hidden="true" className="font-cinzel text-6xl leading-none text-gold-light sm:text-7xl">
            {t("notificationTime")}
          </p>
          <div className="w-full rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-left shadow-[0_20px_50px_-25px_rgba(0,0,0,0.9)]">
            <div className="flex items-center gap-2">
              <Image src="/icon-192.png" alt="" width={20} height={20} className="rounded-[5px]" />
              <span className="text-xs font-medium tracking-wide text-text-dim uppercase">{SITE_NAME}</span>
              <span className="ml-auto text-xs text-text-dim">{t("notificationTime")}</span>
            </div>
            <p className="mt-3 text-sm font-semibold text-text">
              {t("notificationTitle", { name: sample.name })}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-text-dim">{sample.meaning}</p>
          </div>
        </figure>
      </div>
    </section>
  );
}
