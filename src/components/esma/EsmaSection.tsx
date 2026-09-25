import type { ReactNode } from "react";

type Props = {
  id: string;
  title: string;
  children: ReactNode;
};

const corner = "pointer-events-none absolute size-2 border-gold/70";

export default function EsmaSection({ id, title, children }: Props) {
  const headingId = `${id}-title`;

  return (
    <section
      aria-labelledby={headingId}
      className="relative border border-border border-t-gold/25 bg-bg-card p-6 sm:p-8"
    >
      <span aria-hidden="true" className={`${corner} -top-px -left-px border-t border-l`} />
      <span aria-hidden="true" className={`${corner} -top-px -right-px border-t border-r`} />
      <span aria-hidden="true" className={`${corner} -bottom-px -left-px border-b border-l`} />
      <span aria-hidden="true" className={`${corner} -right-px -bottom-px border-r border-b`} />
      <h2
        id={headingId}
        className="mb-5 flex items-center gap-3 text-xs font-medium tracking-[0.3em] text-gold uppercase"
      >
        <span aria-hidden="true" className="size-1.5 rounded-full bg-gold" />
        {title}
      </h2>
      {children}
    </section>
  );
}
