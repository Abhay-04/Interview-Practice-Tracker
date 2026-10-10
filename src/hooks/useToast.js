import { useCallback, useState } from 'react';
import { createId } from '../utils/taskHelpers';

const TOAST_DURATION = 3500;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback((message, type = 'success') => {
    const id = createId();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => dismiss(id), TOAST_DURATION);
  }, [dismiss]);

  return { toasts, notify, dismiss };
}
