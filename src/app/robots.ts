import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
    // AI eğitim botları 2026-10-22 kararıyla bilinçli olarak açık bırakıldı.
    // Engellemek gerekirse SEO deposundaki snippets/robots/robots-ai-training-off.txt kurallarını kullan.
    return {
        rules: {
            userAgent: '*',
            allow: '/',
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
