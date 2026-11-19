export default function SectionTitle({ eyebrow, title, children }) {
  return (
    <div className="reveal mx-auto mb-12 max-w-2xl text-center">
      <span className="inline-block rounded-full bg-sun px-4 py-1 text-sm font-semibold text-ink">
        {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight md:text-5xl">{title}</h2>
      {children && <p className="mt-3 text-lg text-muted">{children}</p>}
    </div>
  );
}
