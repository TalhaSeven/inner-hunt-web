import type { Metadata } from "next";
import Link from "next/link";
import en from "@/messages/en/notFound.json";
import tr from "@/messages/tr/notFound.json";

export const metadata: Metadata = {
  title: `${tr.title} · ${en.title}`,
  robots: { index: false },
};

// Dil bilgisi olmayan 404'ler (ör. dynamicParams = false) buraya düşer; iki dil birlikte gösterilir.
export default function RootNotFound() {
  return (
    <html lang="tr" dir="ltr">
      <body className="flex min-h-dvh items-center justify-center px-4 py-24">
        <div className="flex max-w-xl flex-col items-center gap-10 text-center">
          <p className="font-cinzel text-xs tracking-[0.4em] text-gold uppercase">404</p>
          <section className="flex flex-col items-center gap-3">
            <h1 className="font-cinzel text-3xl text-text">{tr.title}</h1>
            <p className="text-text-dim">{tr.description}</p>
            <Link href="/" className="inline-flex min-h-11 items-center text-sm text-gold underline underline-offset-4 hover:text-gold-light">
              {tr.backHome}
            </Link>
          </section>
          <section lang="en" className="flex flex-col items-center gap-3">
            <h2 className="font-cinzel text-2xl text-text">{en.title}</h2>
            <p className="text-text-dim">{en.description}</p>
            <Link href="/en" className="inline-flex min-h-11 items-center text-sm text-gold underline underline-offset-4 hover:text-gold-light">
              {en.backHome}
            </Link>
          </section>
        </div>
      </body>
    </html>
  );
}
