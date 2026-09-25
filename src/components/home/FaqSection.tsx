import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { localePath } from "@/lib/site";
import SectionHeading from "./SectionHeading";
import styles from "./home.module.css";

const faqKeys = ["price", "offline", "reminder", "languages"] as const;

export default async function FaqSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.faq" });

  return (
    <section aria-labelledby="faq-title" className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className={styles.reveal}>
          <SectionHeading id="faq-title" eyebrow={t("eyebrow")} title={t("title")} />
        </div>
        <div className={`${styles.reveal} flex flex-col gap-8`}>
          <div className="border-t border-border">
            {faqKeys.map((key) => (
              <details key={key} className="group border-b border-border">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-base font-medium text-text transition-colors hover:text-gold-light sm:text-lg [&::-webkit-details-marker]:hidden">
                  {t(`items.${key}.question`)}
                  <span
                    aria-hidden="true"
                    className={`${styles.faqIcon} relative size-4 shrink-0 before:absolute before:top-1/2 before:left-0 before:h-px before:w-full before:bg-gold after:absolute after:top-0 after:left-1/2 after:h-full after:w-px after:bg-gold`}
                  />
                </summary>
                <p className="max-w-2xl pb-6 leading-relaxed text-text-dim">{t(`items.${key}.answer`)}</p>
              </details>
            ))}
          </div>
          <Link
            href={localePath(locale, "/support")}
            className="group inline-flex min-h-11 items-center gap-2 self-start font-medium text-gold-light underline decoration-gold/40 underline-offset-4 transition-colors hover:text-gold hover:decoration-gold"
          >
            {t("more")}
            <span aria-hidden="true" className="no-underline transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
