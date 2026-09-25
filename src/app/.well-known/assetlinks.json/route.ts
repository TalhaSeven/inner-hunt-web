import { APP_PACKAGE_ID } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
    const fingerprints = (process.env.ANDROID_SHA256_CERT_FINGERPRINTS ?? '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
    if (fingerprints.length === 0) return new Response(null, { status: 404 });

    const body = [
        {
            relation: ['delegate_permission/common.handle_all_urls'],
            target: {
                namespace: 'android_app',
                package_name: APP_PACKAGE_ID,
                sha256_cert_fingerprints: fingerprints,
            },
        },
    ];

    return new Response(JSON.stringify(body), {
        headers: { 'Content-Type': 'application/json' },
    });
}
