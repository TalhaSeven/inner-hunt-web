import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import bundleAnalyzer from '@next/bundle-analyzer';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const esmaPagesEnabled = process.env.ESMA_PAGES_ENABLED === 'true';

// Kaldırılan diller ileride geri geleceği için yönlendirmeler geçici (307).
const retiredLocales = ['de', 'es'];

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()'
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self'",
      "img-src 'self' data: blob:",
      "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
      "worker-src 'self'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  experimental: {
    inlineCss: true,
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
  },
  async redirects() {
    const localeRedirects = retiredLocales.flatMap((locale) => [
      { source: `/${locale}`, destination: '/en', permanent: false },
      { source: `/${locale}/:path*`, destination: '/en/:path*', permanent: false },
    ]);

    const esmaRedirects = esmaPagesEnabled
      ? []
      : [
          { source: '/esma', destination: '/', permanent: false },
          { source: '/esma/:path*', destination: '/', permanent: false },
          { source: '/en/esma', destination: '/en', permanent: false },
          { source: '/en/esma/:path*', destination: '/en', permanent: false },
        ];

    return [...localeRedirects, ...esmaRedirects];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
