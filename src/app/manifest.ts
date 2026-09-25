import type { MetadataRoute } from 'next';
import { getTranslations } from 'next-intl/server';
import { defaultLocale } from '@/i18n/routing';
import { APP_PACKAGE_ID, APP_STORE_ID, APP_STORE_URL, PLAY_STORE_URL, SITE_NAME } from '@/lib/site';

const BACKGROUND = '#030305';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
    const t = await getTranslations({ locale: defaultLocale, namespace: 'common.meta' });
    const relatedApplications: NonNullable<MetadataRoute.Manifest['related_applications']> = [
        ...(PLAY_STORE_URL ? [{ platform: 'play', id: APP_PACKAGE_ID, url: PLAY_STORE_URL }] : []),
        ...(APP_STORE_URL ? [{ platform: 'itunes', url: APP_STORE_URL, ...(APP_STORE_ID ? { id: APP_STORE_ID } : {}) }] : []),
    ];

    return {
        name: SITE_NAME,
        short_name: SITE_NAME,
        description: t('description'),
        lang: defaultLocale,
        start_url: '/',
        scope: '/',
        display: 'browser',
        background_color: BACKGROUND,
        theme_color: BACKGROUND,
        icons: [
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
        ...(relatedApplications.length > 0
            ? { related_applications: relatedApplications, prefer_related_applications: true }
            : {}),
    };
}
