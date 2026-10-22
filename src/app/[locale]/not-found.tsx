import Link from "next/link";
import { localePath } from "@/lib/site";
import en from "@/messages/en/notFound.json";
import tr from "@/messages/tr/notFound.json";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-xl flex-col items-center justify-center gap-10 px-4 py-24 text-center">
      <p className="font-cinzel text-xs tracking-[0.4em] text-gold uppercase">404</p>
      <section className="flex flex-col items-center gap-3">
        <h1 className="font-cinzel text-3xl text-text">{tr.title}</h1>
        <p className="text-text-dim">{tr.description}</p>
        <Link
          href={localePath("tr", "/")}
          className="inline-flex min-h-11 items-center text-sm text-gold underline underline-offset-4 hover:text-gold-light"
        >
          {tr.backHome}
        </Link>
      </section>
      <section lang="en" className="flex flex-col items-center gap-3">
        <h2 className="font-cinzel text-2xl text-text">{en.title}</h2>
        <p className="text-text-dim">{en.description}</p>
        <Link
          href={localePath("en", "/")}
          className="inline-flex min-h-11 items-center text-sm text-gold underline underline-offset-4 hover:text-gold-light"
        >
          {en.backHome}
        </Link>
      </section>
    </div>
  );
}
