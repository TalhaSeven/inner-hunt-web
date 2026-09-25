import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { defaultLocale, locales } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale = hasLocale(locales, requested) ? requested : defaultLocale;

    const [common, home, esma, privacy, support, notFound] = await Promise.all([
        import(`../messages/${locale}/common.json`),
        import(`../messages/${locale}/home.json`),
        import(`../messages/${locale}/esma.json`),
        import(`../messages/${locale}/privacy.json`),
        import(`../messages/${locale}/support.json`),
        import(`../messages/${locale}/notFound.json`),
    ]);

    return {
        locale,
        messages: {
            common: common.default,
            home: home.default,
            esma: esma.default,
            privacy: privacy.default,
            support: support.default,
            notFound: notFound.default,
        },
        timeZone: 'Europe/Istanbul',
        onError(error) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('[next-intl]', error.message);
            }
        },
        getMessageFallback({ namespace, key }) {
            return `${namespace}.${key}`;
        },
    };
});
