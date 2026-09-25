import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

// Yeni dil eklerken sadece bu listeyi güncelle; diğer dosyalar buradan okur.
export const locales = ['tr', 'en'] as const;
export const defaultLocale = 'tr';

export type Locale = (typeof locales)[number];

export const routing = defineRouting({
    locales,
    defaultLocale,
    localePrefix: 'as-needed',
    // hreflang bağlantıları metadata'da üretiliyor; Link başlığıyla tekrar edilmesin.
    alternateLinks: false,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
