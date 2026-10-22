import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const HOST = 'www.innerhunt.com';
const ORIGIN = `https://${HOST}`;
const KEY = '22326d5520eabb0ac03be7911c758c07';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const BATCH_SIZE = 10_000;

const responses: Record<number, string> = {
    200: 'Alındı. İndeksleme garantisi değildir.',
    202: 'Alındı, anahtar doğrulaması bekleniyor. İlk gönderimde normaldir; tekrar gönderme.',
    400: 'Geçersiz biçim. İstek gövdesini düzelt.',
    403: 'Anahtar geçersiz. Anahtar dosyasını kontrol et.',
    422: "URL'ler host'a ait değil, anahtar şemaya uymuyor ya da 10.000 URL aşıldı.",
    429: 'Çok fazla istek. Geri çekil ve sonra tekrar dene.',
};

const keyFile = join(resolve(import.meta.dirname, '../public'), `${KEY}.txt`);
if (readFileSync(keyFile, 'utf8').trim() !== KEY) throw new Error(`Anahtar dosyası anahtarla eşleşmiyor: ${keyFile}`);

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const fromSitemap = args.includes('--sitemap');
const inputs = args.filter((arg) => !arg.startsWith('--'));

async function sitemapUrls(): Promise<string[]> {
    const response = await fetch(`${ORIGIN}/sitemap.xml`);
    if (!response.ok) throw new Error(`Sitemap okunamadı: HTTP ${response.status}`);
    const xml = await response.text();
    return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((match) => match[1]);
}

function sameHost(url: string): boolean {
    try {
        return new URL(url).host === HOST;
    } catch {
        return false;
    }
}

const candidates = [...inputs, ...(fromSitemap ? await sitemapUrls() : [])];
const urls = [...new Set(candidates.filter(sameHost))];
const skipped = candidates.filter((url) => !sameHost(url));
if (skipped.length > 0) console.error(`${HOST} dışındaki adresler atlandı: ${skipped.join(', ')}`);

if (urls.length === 0) {
    console.error('Kullanım: pnpm indexnow [--dry-run] [--sitemap] [URL ...]');
    process.exit(1);
}

for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const body = {
        host: HOST,
        key: KEY,
        keyLocation: `${ORIGIN}/${KEY}.txt`,
        urlList: urls.slice(i, i + BATCH_SIZE),
    };

    if (dryRun) {
        console.log(JSON.stringify(body, null, 2));
        continue;
    }

    const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(body),
    });
    const retryAfter = response.headers.get('retry-after');
    const message = responses[response.status] ?? 'Beklenmeyen yanıt.';
    console.log(`HTTP ${response.status} (${body.urlList.length} URL): ${message}${retryAfter ? ` Retry-After: ${retryAfter}` : ''}`);

    if (response.status < 200 || response.status >= 300) process.exit(1);
}
