import { getTranslations } from "next-intl/server";
import { ESMA_COUNT } from "@/content/esma";
import type { Locale } from "@/i18n/routing";
import SectionHeading from "./SectionHeading";
import styles from "./home.module.css";

// Uygulama günün esmasını 37'lik adımla seçer; 91, 37'nin mod 99 tersidir ve her ismin kaçıncı gün geldiğini verir.
const DAILY_STEP_INVERSE = 91;

export default async function DailySection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.daily" });
  const dots = Array.from({ length: ESMA_COUNT }, (_, index) => ({
    index,
    order: (index * DAILY_STEP_INVERSE) % ESMA_COUNT,
  }));

  return (
    <section aria-labelledby="daily-title" className="border-t border-border">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:gap-16">
        <div className={styles.reveal}>
          <SectionHeading id="daily-title" eyebrow={t("eyebrow")} title={t("title")}>
            <p className="font-cinzel text-xl text-gold-light sm:text-2xl">{t("lead")}</p>
            <p className="max-w-xl leading-relaxed text-text-dim">{t("body")}</p>
            <p className="max-w-xl leading-relaxed text-text-dim">{t("detail")}</p>
          </SectionHeading>
        </div>
        <figure className={`${styles.corners} ${styles.reveal} mx-auto w-full max-w-md p-6 sm:p-10`}>
          <div aria-hidden="true" className={styles.dots}>
            {dots.map((dot) => (
              <span
                key={dot.index}
                className={`${styles.dot} ${dot.order === 0 ? styles.dotFirst : ""}`}
                style={{ "--order": dot.order } as React.CSSProperties}
              />
            ))}
          </div>
          <figcaption className="mt-6 text-center text-sm leading-relaxed text-text-dim">
            {t("cycleCaption")}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
