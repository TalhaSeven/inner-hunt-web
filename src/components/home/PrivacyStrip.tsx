import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { localePath } from "@/lib/site";
import styles from "./home.module.css";

const pillarKeys = ["noAccount", "noData", "offline"] as const;

export default async function PrivacyStrip({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.privacy" });

  return (
    <section
      aria-labelledby="privacy-title"
      className="border-y border-gold/20 bg-linear-to-b from-gold/[0.06] to-transparent"
    >
      <div className={`${styles.reveal} mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 sm:py-20`}>
        <h2 id="privacy-title" className="font-cinzel text-xs font-semibold tracking-[0.3em] text-gold uppercase">
          {t("label")}
        </h2>
        <ul className="flex flex-col items-center gap-3 font-cinzel text-xl text-text sm:flex-row sm:flex-wrap sm:justify-center sm:gap-0 sm:text-2xl lg:text-3xl">
          {pillarKeys.map((key, index) => (
            <li key={key} className="flex items-center">
              {index > 0 ? (
                <span aria-hidden="true" className="mx-5 hidden size-1.5 rotate-45 bg-gold sm:inline-block" />
              ) : null}
              {t(key)}
            </li>
          ))}
        </ul>
        <p className="max-w-xl leading-relaxed text-text-dim">{t("body")}</p>
        <Link
          href={localePath(locale, "/privacy")}
          className="inline-flex min-h-11 items-center font-medium text-gold-light underline decoration-gold/40 underline-offset-4 transition-colors hover:text-gold hover:decoration-gold"
        >
          {t("link")}
        </Link>
      </div>
    </section>
  );
}
