const COLORS = {
  dsa: 'bg-sky-500',
  git: 'bg-orange-500',
  fullstack: 'bg-violet-500',
  'machine-coding': 'bg-emerald-500',
};

export default function CategoryDot({ category, className = '' }) {
  return <span aria-hidden="true" className={`inline-block size-2 shrink-0 rounded-full ${COLORS[category] ?? 'bg-zinc-400'} ${className}`} />;
}
