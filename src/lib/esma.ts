import { esmaByNumber, esmaCore, type EsmaCore } from '@/content/esma';
import esmaEn from '@/content/esma.en.json';
import esmaTr from '@/content/esma.tr.json';
import type { Locale } from '@/i18n/routing';

export interface EsmaVerse {
    ref: string;
    text: string;
}

export interface EsmaText {
    name: string;
    meaning: string;
    description: string;
    verses: EsmaVerse[];
    reflection: string;
    practice: string;
}

export interface Esma extends EsmaCore, EsmaText {}

const texts: Record<Locale, Record<string, EsmaText>> = {
    tr: esmaTr,
    en: esmaEn,
};

function merge(locale: Locale, core: EsmaCore): Esma {
    const text = texts[locale][String(core.number)];
    if (!text) throw new Error(`Esma metni eksik: ${locale}/${core.number}`);
    return { ...core, ...text };
}

export function parseEsmaNumber(value: string): number | undefined {
    if (!/^[1-9]\d?$/.test(value)) return undefined;
    const n = Number(value);
    return esmaByNumber[n] ? n : undefined;
}

export function getEsma(locale: Locale, n: number): Esma | undefined {
    const core = esmaByNumber[n];
    return core ? merge(locale, core) : undefined;
}

export function getAllEsma(locale: Locale): Esma[] {
    return esmaCore.map((core) => merge(locale, core));
}
