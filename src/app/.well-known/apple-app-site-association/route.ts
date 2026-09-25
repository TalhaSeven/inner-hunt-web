import { APP_PACKAGE_ID } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
    const teamId = process.env.APPLE_TEAM_ID?.trim();
    if (!teamId) return new Response(null, { status: 404 });

    const body = {
        applinks: {
            details: [
                {
                    appIDs: [`${teamId}.${APP_PACKAGE_ID}`],
                    components: [{ '/': '/esma/*' }, { '/': '/en/esma/*' }],
                },
            ],
        },
    };

    return new Response(JSON.stringify(body), {
        headers: { 'Content-Type': 'application/json' },
    });
}
