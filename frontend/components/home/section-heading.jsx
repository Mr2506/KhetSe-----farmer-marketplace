export function SectionHeading({ title, action }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-900">{title}</h2>
      {action ? <span className="text-sm font-medium text-zinc-500">{action}</span> : null}
    </div>
  );
}