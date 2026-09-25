import { getTranslations } from "next-intl/server";
import { moods, type MoodId } from "@/content/moods";
import moodsEn from "@/content/moods.en.json";
import moodsTr from "@/content/moods.tr.json";
import type { Locale } from "@/i18n/routing";
import SectionHeading from "./SectionHeading";
import styles from "./home.module.css";

const moodTexts: Record<Locale, Record<MoodId, { name: string; tags: string }>> = {
  tr: moodsTr,
  en: moodsEn,
};

export default async function MoodsSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.moods" });
  const texts = moodTexts[locale];

  return (
    <section aria-labelledby="moods-title" className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-20 sm:px-6 sm:py-28">
        <div className={styles.reveal}>
          <SectionHeading id="moods-title" eyebrow={t("eyebrow")} title={t("title")}>
            <p className="max-w-2xl leading-relaxed text-text-dim">{t("body")}</p>
          </SectionHeading>
        </div>
        <ul aria-label={t("listLabel")} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {moods.map((mood) => (
            <li
              key={mood.id}
              className={`${styles.mood} ${styles.reveal} flex flex-col gap-3 border border-border p-4 sm:p-6`}
              style={{ "--accent": mood.accentColor } as React.CSSProperties}
            >
              <span aria-hidden="true" className="text-2xl leading-none sm:text-3xl">
                {mood.emoji}
              </span>
              <h3 className="text-[0.95rem] leading-snug font-medium text-text sm:text-base">
                {texts[mood.id].name}
              </h3>
              <p className="text-xs leading-relaxed text-text-dim sm:text-sm">{texts[mood.id].tags}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
