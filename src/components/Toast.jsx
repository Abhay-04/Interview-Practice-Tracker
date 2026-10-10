import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function ToastStack({ toasts, onDismiss }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
    >
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const Icon = isError ? AlertCircle : CheckCircle2;
        return (
          <div
            key={toast.id}
            role={isError ? 'alert' : 'status'}
            className="card pointer-events-auto flex w-full max-w-sm motion-safe:animate-toast-in items-start gap-3 px-4 py-3 shadow-lg"
          >
            <Icon className={`mt-0.5 size-4 shrink-0 ${isError ? 'text-red-500' : 'text-emerald-500'}`} aria-hidden="true" />
            <p className="flex-1 text-sm">{toast.message}</p>
            <button type="button" onClick={() => onDismiss(toast.id)} className="icon-btn -my-1 -mr-2 size-7" aria-label="Dismiss notification">
              <X className="size-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
