import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmDialog({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      size="sm"
      footer={
        <>
          <button type="button" className="btn-secondary" onClick={onCancel} autoFocus>Cancel</button>
          <button type="button" className="btn-danger" onClick={onConfirm}>{confirmLabel}</button>
        </>
      }
    >
      <div className="flex gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <AlertTriangle className="size-4" aria-hidden="true" />
        </span>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{message}</p>
      </div>
    </Modal>
  );
}
