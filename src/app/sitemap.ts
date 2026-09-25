import type { MetadataRoute } from 'next';
import { esmaCore } from '@/content/esma';
import { locales } from '@/i18n/routing';
import { ESMA_PAGES_ENABLED, absoluteUrl, alternates } from '@/lib/site';

// Build zamanında bir kez hesaplanır; statik sitemap'teki bütün adresler aynı tarihi taşır.
const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
    const paths = [
        '/',
        '/privacy',
        '/support',
        ...(ESMA_PAGES_ENABLED ? ['/esma', ...esmaCore.map((esma) => `/esma/${esma.number}`)] : []),
    ];

    return paths.flatMap((path) =>
        locales.map((locale) => ({
            url: absoluteUrl(locale, path),
            lastModified,
            alternates: { languages: alternates(path) },
        })),
    );
}
