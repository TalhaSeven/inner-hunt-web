import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const appRepo = resolve(process.env.APP_REPO_PATH || '/Users/App-Projects/inner-hunt');
const root = resolve(import.meta.dirname, '..');
const publicDir = join(root, 'public/screens');
const manifestPath = join(root, 'src/content/screens.ts');
const locales = ['tr', 'en'] as const;
const platforms = ['ios', 'play'];

type Screen = { name: string; src: string; width: number; height: number };

function findSource(locale: string): string | undefined {
    for (const platform of platforms) {
        const dir = join(appRepo, 'store-assets', platform, locale);
        if (existsSync(dir) && readdirSync(dir).some((f) => /^phone-.*\.png$/.test(f))) return dir;
    }
    return undefined;
}

function dimensions(file: string): { width: number; height: number } {
    const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' });
    const width = Number(out.match(/pixelWidth:\s*(\d+)/)?.[1]);
    const height = Number(out.match(/pixelHeight:\s*(\d+)/)?.[1]);
    if (!width || !height) throw new Error(`Ölçü okunamadı: ${file}`);
    return { width, height };
}

const sources = Object.fromEntries(locales.map((locale) => [locale, findSource(locale)]));
if (!sources.tr) throw new Error(`Türkçe ekran görüntüsü bulunamadı: ${join(appRepo, 'store-assets')}`);

rmSync(publicDir, { recursive: true, force: true });

const manifest: Record<string, Screen[]> = {};

for (const locale of locales) {
    let source = sources[locale];
    if (!source) {
        console.warn(`UYARI: ${locale} için ekran görüntüsü yok; tr görselleri kopyalanıyor.`);
        source = sources.tr;
    }

    const target = join(publicDir, locale);
    mkdirSync(target, { recursive: true });

    const files = readdirSync(source).filter((f) => /^phone-.*\.png$/.test(f)).sort();
    manifest[locale] = files.map((file) => {
        copyFileSync(join(source, file), join(target, file));
        console.log(`public/screens/${locale}/${file}`);
        return {
            name: file.replace(/^phone-\d+-/, '').replace(/\.png$/, ''),
            src: `/screens/${locale}/${file}`,
            ...dimensions(join(target, file)),
        };
    });
}

const body = `// Bu dosya \`pnpm sync:assets\` ile üretilir; elle düzenleme.

import type { Locale } from '@/i18n/routing';

export type Screen = { name: string; src: string; width: number; height: number };

export const screens: Record<Locale, Screen[]> = ${JSON.stringify(manifest, null, 4)};
`;

writeFileSync(manifestPath, body);
console.log('src/content/screens.ts');
