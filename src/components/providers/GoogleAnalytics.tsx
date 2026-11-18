import Script from "next/script";

// lazyOnload: gtag.js sayfa yüklendikten sonra iner; LCP ile yarışmaz.
export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  return (
    <>
      <Script id="ga-init" strategy="lazyOnload">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(gaId)});`}
      </Script>
      <Script
        id="ga-script"
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
      />
    </>
  );
}
