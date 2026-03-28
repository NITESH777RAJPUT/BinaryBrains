const SectionHeading = ({ eyebrow, title, description, actions }) => (
  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
    <div>
      {eyebrow ? (
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">{eyebrow}</p>
      ) : null}
      <h1 className="mt-2 font-display text-4xl font-semibold text-slate-900 dark:text-white">{title}</h1>
      {description ? <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">{description}</p> : null}
    </div>
    {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
  </div>
);

export default SectionHeading;
