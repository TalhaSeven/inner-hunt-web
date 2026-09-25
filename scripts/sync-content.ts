import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
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
