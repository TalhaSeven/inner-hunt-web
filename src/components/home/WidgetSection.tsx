import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { esmaByNumber } from "@/content/esma";
import esmaEn from "@/content/esma.en.json";
import esmaTr from "@/content/esma.tr.json";
import type { Locale } from "@/i18n/routing";
import { localePath } from "@/lib/site";
import SectionHeading from "./SectionHeading";
import styles from "./home.module.css";

const sampleEsma: Record<Locale, { name: string; meaning: string }> = {
  tr: esmaTr["1"],
  en: esmaEn["1"],
};

export default async function WidgetSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.widget" });
  const sample = sampleEsma[locale];

  return (
    <section aria-labelledby="widget-title" className="border-t border-border">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:gap-16">
        <div className={`${styles.reveal} flex flex-col gap-8`}>
          <SectionHeading id="widget-title" eyebrow={t("eyebrow")} title={t("title")}>
            <p className="max-w-xl leading-relaxed text-text-dim">{t("body")}</p>
            <p className="max-w-xl leading-relaxed text-text-dim">{t("local")}</p>
          </SectionHeading>
          <Link
            href={localePath(locale, "/support#addWidget")}
            className="group inline-flex min-h-11 items-center gap-2 self-start font-medium text-gold-light underline decoration-gold/40 underline-offset-4 transition-colors hover:text-gold hover:decoration-gold"
          >
            {t("howTo")}
            <span aria-hidden="true" className="no-underline transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
        <figure
          className={`${styles.corners} ${styles.reveal} mx-auto flex w-full max-w-md flex-col items-center gap-8 px-5 py-10 sm:px-10 sm:py-14 lg:order-first`}
        >
          <figcaption className="font-cinzel text-xs font-semibold tracking-[0.3em] text-text-dim uppercase">
            {t("previewLabel")}
          </figcaption>
          <div className="flex w-full max-w-xs [contain-intrinsic-size:auto_13rem] flex-col [content-visibility:auto] items-center gap-1 rounded-[22px] border border-white/10 bg-[#030305] px-5 py-6 text-center shadow-[0_20px_50px_-25px_rgba(0,0,0,0.9)]">
            <p className="text-xs font-medium text-gold">{t("widgetLabel")}</p>
            <p lang="ar" dir="rtl" className="font-amiri text-4xl leading-[1.7] text-white">
              {esmaByNumber[1].arabic}
            </p>
            <p className="font-semibold text-gold-light">{sample.name}</p>
            <p className="line-clamp-2 text-sm leading-relaxed text-text-dim">{sample.meaning}</p>
          </div>
        </figure>
      </div>
    </section>
  );
}
