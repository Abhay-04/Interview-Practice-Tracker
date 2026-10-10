import { useEffect, useId } from 'react';
import { X } from 'lucide-react';

/** Accessible dialog shell. Parents mount it only while open, so form state resets naturally. */
export default function Modal({ title, description, onClose, children, footer, size = 'md' }) {
  const titleId = useId();

  useEffect(() => {
    const onKeyDown = (event) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-zinc-950/50 motion-safe:animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative flex max-h-[92vh] w-full flex-col rounded-t-2xl border border-zinc-200 bg-white shadow-2xl motion-safe:animate-pop-in sm:rounded-xl dark:border-zinc-800 dark:bg-zinc-900 ${size === 'lg' ? 'sm:max-w-2xl' : size === 'sm' ? 'sm:max-w-md' : 'sm:max-w-lg'}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <div className="min-w-0">
            <h2 id={titleId} className="text-base font-semibold">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>}
          </div>
          <button type="button" onClick={onClose} className="icon-btn -mr-2 shrink-0" aria-label="Close dialog">
            <X className="size-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5">{children}</div>
        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-zinc-200 px-5 py-3 dark:border-zinc-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
