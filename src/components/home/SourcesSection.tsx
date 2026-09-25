import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import SectionHeading from "./SectionHeading";
import styles from "./home.module.css";

const sourceKeys = ["trTranslation", "enTranslation", "order"] as const;

export default async function SourcesSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.sources" });

  return (
    <section aria-labelledby="sources-title">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-20 sm:px-6 sm:py-28">
        <div className={styles.reveal}>
          <SectionHeading id="sources-title" eyebrow={t("eyebrow")} title={t("title")}>
            <p className="max-w-2xl leading-relaxed text-text-dim">{t("body")}</p>
          </SectionHeading>
        </div>
        <dl className="grid gap-4 sm:grid-cols-3">
          {sourceKeys.map((key) => (
            <div key={key} className={`${styles.corners} ${styles.reveal} flex flex-col gap-2 p-6`}>
              <dt className="text-sm text-text-dim">{t(`items.${key}.label`)}</dt>
              <dd className="text-lg font-medium text-text">{t(`items.${key}.value`)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
