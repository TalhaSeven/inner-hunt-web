# Inner Hunt — Web

Bu depo, **Inner Hunt** mobil uygulamasının (iOS ve Android, `com.innerhunt.app`) tanıtım sitesidir. Site; uygulamayı tanıtır, App Store ve Google Play bağlantılarını verir, uygulamanın içinden açılan gizlilik (`/privacy`) ve destek (`/support`) sayfalarını sunar ve isteğe bağlı olarak 99 ismin her biri için bir sayfa (`/esma`, `/esma/[number]`) yayımlar.

Inner Hunt; Esmâü'l-Hüsnâ ile günlük tefekkür uygulamasıdır: her gün bir isim (99 günde her isim bir kez), sekiz hâlden birine uygun bir esma, 99 ismin kütüphanesi ve cihazda planlanan günlük hatırlatıcı. Ücretsizdir; satın alma ve reklam yoktur, hesap istemez ve internetsiz çalışır.

## Teknoloji

- Next.js 16 (App Router, statik üretim), React 19, TypeScript (strict)
- next-intl 4 — Türkçe (varsayılan, öneksiz) ve İngilizce (`/en`)
- Tailwind CSS v4
- Vercel Analytics ve Speed Insights (çerezsiz)

## Geliştirme

```bash
pnpm install
cp .env.example .env.local   # isteğe bağlı
pnpm dev
```

Diğer komutlar: `pnpm build`, `pnpm start`, `pnpm lint`, `pnpm exec tsc --noEmit`.

## Ortam değişkenleri

Hepsi isteğe bağlıdır. Boş bırakılan her değişkenin ilgili özelliği görünmez olur; site yine de derlenir.

| Değişken | Açıklama | Boşsa |
|---|---|---|
| `NEXT_PUBLIC_APP_STORE_URL` | App Store sayfası. App Store ID bu adresteki `id<rakamlar>` kısmından türetilir. | App Store rozeti pasif ve "Yakında" etiketli; iOS Smart Banner ve iOS `MobileApplication` JSON-LD'si yok |
| `NEXT_PUBLIC_PLAY_STORE_URL` | Google Play sayfası | Play rozeti pasif ve "Yakında" etiketli; Android `MobileApplication` JSON-LD'si yok |
| `ESMA_PAGES_ENABLED` | `true` ise `/esma` sayfaları yayımlanır | `/esma` adresleri 307 ile ana sayfaya yönlenir; sitemap'te ve ana sayfada yer almaz |
| `APPLE_TEAM_ID` | `/.well-known/apple-app-site-association` (Universal Links) için | Dosya 404 döner |
| `ANDROID_SHA256_CERT_FINGERPRINTS` | `/.well-known/assetlinks.json` (App Links) için; virgülle ayrılmış SHA-256 parmak izleri | Dosya 404 döner |
| `APP_REPO_PATH` | Sync script'lerinin okuduğu mobil uygulama deposu | `/Users/App-Projects/inner-hunt` |

`NEXT_PUBLIC_*` ve `ESMA_PAGES_ENABLED` derleme zamanında okunur; değiştirdikten sonra yeniden derlemek gerekir.

## İçeriği mobil uygulamadan eşitleme (`pnpm sync`)

İçerik, ekran görüntüleri ve ikonlar elle düzenlenmez; mobil uygulama deposundan (`APP_REPO_PATH`) kopyalanır. Script'ler Node 22 ve üstünde `--experimental-strip-types` ile çalışır; ikon ve ölçü işlemleri için macOS'teki `sips` kullanılır.

| Komut | Kaynak (mobil depo) | Hedef (bu depo) |
|---|---|---|
| `pnpm sync:content` | `src/content/{esma.ts,moods.ts,esma.tr.json,esma.en.json}`, `src/i18n/{tr,en}.json` içindeki `mood.moods` | `src/content/` (`moods.{tr,en}.json` dahil) |
| `pnpm sync:assets` | `store-assets/{ios,play}/{tr,en}/phone-*.png` | `public/screens/{tr,en}/` ve `src/content/screens.ts` |
| `pnpm sync:icons` | `assets/images/icon.png` | `src/app/icon.png`, `src/app/apple-icon.png`, `public/icon-192.png`, `public/icon-512.png` |
| `pnpm sync` | Üçünü sırayla çalıştırır | |

Akış: mobil depoda içerik ya da görsel değişir → bu depoda `pnpm sync` → `git diff` ile değişiklikleri kontrol et → `pnpm build` → commit.

## Yeni dil ekleme

1. `src/i18n/routing.ts` içindeki `locales` listesine dil kodunu ekle. Sitemap, hreflang, manifest ve JSON-LD bu listeden okur.
2. `src/messages/<locale>/` altında `common`, `home`, `esma`, `privacy`, `support` ve `notFound` JSON dosyalarını oluştur. Anahtarlar `tr` dosyalarıyla birebir aynı olmalı.
3. Mobil uygulamada o dilin içeriği (`esma.<locale>.json`, `src/i18n/<locale>.json`) ve mağaza ekran görüntüleri hazırsa `scripts/sync-content.ts` ile `scripts/sync-assets.ts` içindeki `locales` listesine ekleyip `pnpm sync` çalıştır.
4. `next.config.ts` içindeki `retiredLocales` listesinde bu dil varsa (ör. `de`, `es`) onu listeden çıkar; aksi halde o dilin adresleri geçici (307) olarak `/en`'e yönlenmeye devam eder.

## Uygulamaya gömülü adresler

Mobil uygulama şu adresleri açar; kaldırılmamalı ya da taşınmamalıdır:

- `/privacy`, `/en/privacy` (`/tr/privacy` → `/privacy`)
- `/support`, `/en/support`
- `/esma/[number]`, `/en/esma/[number]` (paylaşım bağlantıları ve Universal/App Links)

## İletişim

info@talhaseven.com
