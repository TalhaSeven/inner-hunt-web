import { execFileSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

const appRepo = resolve(process.env.APP_REPO_PATH || '/Users/App-Projects/inner-hunt');
const root = resolve(import.meta.dirname, '..');
const source = join(appRepo, 'assets/images/icon.png');

if (!existsSync(source)) throw new Error(`İkon bulunamadı: ${source}`);

const outputs: [string, number][] = [
    ['src/app/icon.png', 512],
    ['src/app/apple-icon.png', 180],
    ['public/icon-192.png', 192],
    ['public/icon-512.png', 512],
];

for (const [file, size] of outputs) {
    execFileSync('sips', ['-z', String(size), String(size), source, '--out', join(root, file)], { stdio: 'ignore' });
    console.log(file);
}

rmSync(join(root, 'src/app/favicon.ico'), { force: true });
