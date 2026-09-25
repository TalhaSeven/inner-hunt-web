import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { ESMA_PAGES_ENABLED, localePath } from "@/lib/site";
import PhoneFrame, { getScreen } from "./PhoneFrame";
import SectionHeading from "./SectionHeading";
import styles from "./home.module.css";

const anatomyKeys = [
  "number",
  "meaning",
  "description",
  "verses",
  "reflection",
  "practice",
  "dhikr",
  "share",
] as const;

export default async function NamesSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.names" });

  return (
    <section aria-labelledby="names-title" className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-24 px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className={styles.reveal}>
            <SectionHeading id="names-title" eyebrow={t("eyebrow")} title={t("title")}>
              <p className="max-w-xl leading-relaxed text-text-dim">{t("body")}</p>
              {ESMA_PAGES_ENABLED ? (
                <Link
                  href={localePath(locale, "/esma")}
                  className="group inline-flex min-h-11 items-center gap-2 self-start font-cinzel text-sm font-semibold tracking-[0.15em] text-gold-light uppercase transition-colors hover:text-gold"
                >
                  {t("browseAll")}
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              ) : null}
            </SectionHeading>
          </div>
          <PhoneFrame
            screen={getScreen(locale, "kutuphane")}
            alt={t("libraryImageAlt")}
            sizes="(min-width: 640px) 260px, 230px"
            className={`${styles.reveal} mx-auto w-[230px] sm:w-[260px]`}
          />
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div className={`${styles.reveal} flex flex-col gap-8 lg:order-2`}>
            <div className="flex flex-col gap-3">
              <h3 className="font-cinzel text-2xl leading-snug text-text sm:text-3xl">{t("anatomyTitle")}</h3>
              <p className="max-w-xl leading-relaxed text-text-dim">{t("anatomyLead")}</p>
            </div>
            <ol className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {anatomyKeys.map((key, index) => (
                <li key={key} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="w-7 shrink-0 pt-0.5 font-cinzel text-sm font-semibold tracking-wider text-gold"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-medium text-text">{t(`anatomy.${key}.title`)}</h4>
                    <p className="text-sm leading-relaxed text-text-dim">{t(`anatomy.${key}.text`)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className={`${styles.reveal} flex items-start justify-center gap-3 sm:gap-6 lg:order-1`}>
            <PhoneFrame
              screen={getScreen(locale, "esma-detay")}
              alt={t("detailImageAlt")}
              sizes="(min-width: 640px) 230px, 46vw"
              className="w-[calc(50%-0.375rem)] max-w-[230px]"
            />
            <PhoneFrame
              screen={getScreen(locale, "ayet-tefekkur")}
              alt={t("versesImageAlt")}
              sizes="(min-width: 640px) 230px, 46vw"
              className="mt-12 w-[calc(50%-0.375rem)] max-w-[230px] sm:mt-20"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
