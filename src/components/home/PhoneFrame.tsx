import Image from "next/image";
import type { Locale } from "@/i18n/routing";
import { screens, type Screen } from "@/content/screens";
import styles from "./home.module.css";

type Props = {
  screen: Screen;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

export default function PhoneFrame({ screen, alt, sizes, priority = false, className = "" }: Props) {
  return (
    <div className={`${styles.phone} ${className}`}>
      <div className={styles.screen}>
        <Image
          src={screen.src}
          alt={alt}
          width={screen.width}
          height={screen.height}
          sizes={sizes}
          preload={priority}
          fetchPriority={priority ? "high" : undefined}
          loading={priority ? "eager" : undefined}
        />
      </div>
    </div>
  );
}

export function getScreen(locale: Locale, name: string): Screen {
  const screen = screens[locale].find((item) => item.name === name);
  if (!screen) throw new Error(`Ekran görüntüsü bulunamadı: ${locale}/${name}`);
  return screen;
}
