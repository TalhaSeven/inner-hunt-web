import { defaultLocale, locales, type Locale } from '@/i18n/routing';

// Vercel'de apex, www'ya yönleniyor; uygulama da www adresini kullanıyor.
export const SITE_URL = 'https://www.innerhunt.com';
export const SITE_NAME = 'Inner Hunt';
export const SUPPORT_EMAIL = 'info@talhaseven.com';
export const APP_PACKAGE_ID = 'com.innerhunt.app';

export const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL || undefined;
export const PLAY_STORE_URL = process.env.NEXT_PUBLIC_PLAY_STORE_URL || undefined;
export const APP_STORE_ID = APP_STORE_URL?.match(/id(\d+)/)?.[1];
export const ESMA_PAGES_ENABLED = process.env.ESMA_PAGES_ENABLED === 'true';

export function localePath(locale: Locale, path = '/'): string {
    const normalized = path === '/' || path === '' ? '' : path.startsWith('/') ? path : `/${path}`;
    if (locale === defaultLocale) return normalized || '/';
    return `/${locale}${normalized}`;
}

export function absoluteUrl(locale: Locale, path = '/'): string {
    const localized = localePath(locale, path);
    return localized === '/' ? SITE_URL : `${SITE_URL}${localized}`;
}

export function alternates(path = '/'): Record<Locale | 'x-default', string> {
    const languages = Object.fromEntries(
        locales.map((locale) => [locale, absoluteUrl(locale, path)]),
    ) as Record<Locale, string>;
    return { ...languages, 'x-default': absoluteUrl(defaultLocale, path) };
}
