import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, locales, routing, type Locale } from '@/i18n/routing';
import { APP_STORE_URL, PLAY_STORE_URL, localePath } from '@/lib/site';

const intlMiddleware = createMiddleware(routing);

function isLocale(value: string | undefined): value is Locale {
    return locales.includes(value as Locale);
}

function downloadLocale(pathname: string): Locale | undefined {
    if (pathname === '/download') return defaultLocale;
    const [, locale, segment, ...rest] = pathname.split('/');
    if (segment === 'download' && rest.length === 0 && locale !== defaultLocale && isLocale(locale)) {
        return locale;
    }
    return undefined;
}

function storeUrlFor(userAgent: string): string | undefined {
    if (/iPhone|iPad|iPod/i.test(userAgent)) return APP_STORE_URL;
    if (/Android/i.test(userAgent)) return PLAY_STORE_URL;
    return undefined;
}

export default function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const locale = downloadLocale(pathname);
    if (locale) {
        const storeUrl = storeUrlFor(request.headers.get('user-agent') ?? '');
        if (storeUrl) return NextResponse.redirect(storeUrl, 307);
        return NextResponse.redirect(new URL(localePath(locale), request.url), 307);
    }

    // Next, varsayılan dilin OG görsel adresini /tr/ önekiyle üretir; yönlendirmeden doğrudan sun.
    if (pathname.startsWith(`/${defaultLocale}/`) && pathname.includes('/opengraph-image')) {
        return NextResponse.next();
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
