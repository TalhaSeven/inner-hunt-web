import { getTranslations } from "next-intl/server";
import StoreBadges from "@/components/site/StoreBadges";
import type { Locale } from "@/i18n/routing";

export default async function EsmaAppBox({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "esma.app" });

  return (
    <section
      aria-labelledby="esma-app-title"
      className="border border-gold/25 bg-gold/[0.03] px-6 py-10 text-center sm:px-10"
    >
      <h2
        id="esma-app-title"
        className="font-cinzel text-xl font-semibold text-gold-light sm:text-2xl"
      >
        {t("title")}
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-text-dim">
        {t("body")}
      </p>
      <StoreBadges locale={locale} align="center" className="mt-8" />
      <p className="mt-6 text-xs tracking-[0.2em] text-text-dim uppercase">{t("note")}</p>
    </section>
  );
}
