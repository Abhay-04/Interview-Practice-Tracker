const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ProgressRing({ value, label, size = 128 }) {
  const clamped = Math.min(100, Math.max(0, value));
  const offset = CIRCUMFERENCE * (1 - clamped / 100);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className="size-full -rotate-90" role="img" aria-label={`${label}: ${clamped}%`}>
        <circle cx="60" cy="60" r={RADIUS} fill="none" strokeWidth="10" className="stroke-zinc-100 dark:stroke-zinc-800" />
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className={`transition-[stroke-dashoffset] duration-700 ease-out ${clamped === 100 ? 'stroke-emerald-500' : 'stroke-indigo-600 dark:stroke-indigo-500'}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tabular-nums tracking-tight">{clamped}%</span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
      </div>
    </div>
  );
}
