import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const appRepo = resolve(process.env.APP_REPO_PATH || '/Users/App-Projects/inner-hunt');
const outDir = resolve(import.meta.dirname, '../src/content');
const locales = ['tr', 'en'];
const header = '// Bu dosya `pnpm sync:content` ile üretilir; elle düzenleme.\n\n';

mkdirSync(outDir, { recursive: true });

for (const file of ['esma.ts', 'moods.ts']) {
    const source = readFileSync(join(appRepo, 'src/content', file), 'utf8');
    writeFileSync(join(outDir, file), header + source);
    console.log(`src/content/${file}`);
}

for (const locale of locales) {
    const file = `esma.${locale}.json`;
    const source = readFileSync(join(appRepo, 'src/content', file), 'utf8');
    writeFileSync(join(outDir, file), source);
    console.log(`src/content/${file}`);

    const messages = JSON.parse(readFileSync(join(appRepo, 'src/i18n', `${locale}.json`), 'utf8'));
    const moods = messages?.mood?.moods;
    if (!moods) throw new Error(`mood.moods bulunamadı: src/i18n/${locale}.json`);
    writeFileSync(join(outDir, `moods.${locale}.json`), JSON.stringify(moods, null, 2) + '\n');
    console.log(`src/content/moods.${locale}.json`);
}

const iconDir = join(appRepo, 'assets/icons/moods');
const icons = readdirSync(iconDir)
    .filter((file) => /^[a-h]\.svg$/.test(file))
    .sort()
    .map((file) => {
        const svg = readFileSync(join(iconDir, file), 'utf8');
        if (!svg.includes('viewBox="0 0 24 24"')) throw new Error(`Beklenmeyen viewBox: ${file}`);
        const inner = svg
            .replace(/^[\s\S]*?<svg[^>]*>/, '')
            .replace(/<\/svg>[\s\S]*$/, '')
            .replace(/#ffffff/gi, 'currentColor')
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
            .join('');
        return `  ${file[0].toUpperCase()}: ${JSON.stringify(inner)},`;
    });
if (icons.length !== 8) throw new Error(`8 ruh hali ikonu bekleniyordu, ${icons.length} bulundu: ${iconDir}`);
writeFileSync(
    join(outDir, 'mood-icons.ts'),
    `${header}import type { MoodId } from './moods';\n\nexport const moodIcons: Record<MoodId, string> = {\n${icons.join('\n')}\n};\n`,
);
console.log('src/content/mood-icons.ts');
