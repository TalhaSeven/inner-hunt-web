// Bu dosya `pnpm sync:assets` ile üretilir; elle düzenleme.

import type { Locale } from '@/i18n/routing';

export type Screen = { name: string; src: string; width: number; height: number };

export const screens: Record<Locale, Screen[]> = {
    "tr": [
        {
            "name": "bugun",
            "src": "/screens/tr/phone-01-bugun.png",
            "width": 1080,
            "height": 1920
        },
        {
            "name": "esma-detay",
            "src": "/screens/tr/phone-02-esma-detay.png",
            "width": 1080,
            "height": 1920
        },
        {
            "name": "ayet-tefekkur",
            "src": "/screens/tr/phone-03-ayet-tefekkur.png",
            "width": 1080,
            "height": 1920
        },
        {
            "name": "kutuphane",
            "src": "/screens/tr/phone-04-kutuphane.png",
            "width": 1080,
            "height": 1920
        },
        {
            "name": "ayarlar",
            "src": "/screens/tr/phone-05-ayarlar.png",
            "width": 1080,
            "height": 1920
        }
    ],
    "en": [
        {
            "name": "bugun",
            "src": "/screens/en/phone-01-bugun.png",
            "width": 1080,
            "height": 1920
        },
        {
            "name": "esma-detay",
            "src": "/screens/en/phone-02-esma-detay.png",
            "width": 1080,
            "height": 1920
        },
        {
            "name": "ayet-tefekkur",
            "src": "/screens/en/phone-03-ayet-tefekkur.png",
            "width": 1080,
            "height": 1920
        },
        {
            "name": "kutuphane",
            "src": "/screens/en/phone-04-kutuphane.png",
            "width": 1080,
            "height": 1920
        },
        {
            "name": "ayarlar",
            "src": "/screens/en/phone-05-ayarlar.png",
            "width": 1080,
            "height": 1920
        }
    ]
};
