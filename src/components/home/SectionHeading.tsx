type Props = {
  id: string;
  eyebrow: string;
  title: string;
  align?: "start" | "center";
  children?: React.ReactNode;
};

export default function SectionHeading({ id, eyebrow, title, align = "start", children }: Props) {
  const centered = align === "center";

  return (
    <div className={`flex flex-col gap-4 ${centered ? "items-center text-center" : ""}`}>
      <p className="font-cinzel text-xs font-semibold tracking-[0.3em] text-gold uppercase">{eyebrow}</p>
      <h2 id={id} className="font-cinzel text-3xl leading-tight text-text sm:text-4xl">
        {title}
      </h2>
      <Ornament centered={centered} />
      {children}
    </div>
  );
}

export function Ornament({ centered = false }: { centered?: boolean }) {
  return (
    <div aria-hidden="true" className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
      <span className="h-px w-12 bg-gold/40" />
      <span className="size-1.5 rotate-45 bg-gold" />
      <span className="h-px w-12 bg-gold/40" />
    </div>
  );
}
