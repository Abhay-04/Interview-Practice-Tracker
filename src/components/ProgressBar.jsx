const TONES = {
  indigo: 'bg-indigo-600 dark:bg-indigo-500',
  green: 'bg-emerald-500',
};

export default function ProgressBar({ value, label, size = 'md', className = '' }) {
  const clamped = Math.min(100, Math.max(0, value));
  const tone = clamped === 100 ? 'green' : 'indigo';
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800 ${size === 'sm' ? 'h-1.5' : 'h-2'} ${className}`}
    >
      <div className={`h-full rounded-full transition-[width] duration-500 ease-out ${TONES[tone]}`} style={{ width: `${clamped}%` }} />
    </div>
  );
}
