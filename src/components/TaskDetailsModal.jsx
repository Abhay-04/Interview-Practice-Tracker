import { useState } from 'react';
import { ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { CATEGORY_MAP, PRIORITY_MAP, STATUSES } from '../data/constants';
import { formatShortDate, isOverdue } from '../utils/dateHelpers';
import { isValidUrl } from '../utils/taskHelpers';
import Badge, { PRIORITY_TONE } from './Badge';
import CategoryDot from './CategoryDot';
import Modal from './Modal';

const EDITABLE_FIELDS = ['status', 'url', 'notes', 'learned', 'revise'];
const pick = (task) => Object.fromEntries(EDITABLE_FIELDS.map((key) => [key, task[key]]));

export default function TaskDetailsModal({ task, onSave, onEdit, onDelete, onClose }) {
  const category = CATEGORY_MAP[task.category];
  const [draft, setDraft] = useState(() => pick(task));
  const [urlError, setUrlError] = useState('');
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const isDirty = EDITABLE_FIELDS.some((key) => draft[key] !== task[key]);
  const update = (key) => (event) => setDraft((prev) => ({ ...prev, [key]: event.target.value }));

  const handleClose = () => (isDirty ? setConfirmDiscard(true) : onClose());

  const handleSave = () => {
    const url = draft.url.trim();
    if (url && !isValidUrl(url)) {
      setUrlError('Enter a full URL starting with http:// or https://');
      return;
    }
    setUrlError('');
    onSave(task.id, { ...draft, url });
  };

  const overdue = task.status !== 'completed' && isOverdue(task.dueDate);

  const footer = confirmDiscard ? (
    <>
      <p className="mr-auto text-sm text-zinc-600 dark:text-zinc-300">Discard unsaved changes?</p>
      <button type="button" className="btn-secondary" onClick={() => setConfirmDiscard(false)}>Keep editing</button>
      <button type="button" className="btn-danger" onClick={onClose}>Discard</button>
    </>
  ) : (
    <>
      <div className="mr-auto flex gap-1">
        <button type="button" className="btn-ghost px-2.5" onClick={() => onEdit(task)}>
          <Pencil className="size-4" aria-hidden="true" /> Edit
        </button>
        <button type="button" className="btn-ghost px-2.5 hover:text-red-600 dark:hover:text-red-400" onClick={() => onDelete(task)}>
          <Trash2 className="size-4" aria-hidden="true" /> Delete
        </button>
      </div>
      <button type="button" className="btn-secondary" onClick={handleClose}>Close</button>
      <button type="button" className="btn-primary" onClick={handleSave} disabled={!isDirty}>Save changes</button>
    </>
  );

  return (
    <Modal title={task.title} onClose={handleClose} size="lg" footer={footer}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-1.5 py-0.5 font-medium dark:border-zinc-700">
            <CategoryDot category={task.category} /> {category.label}
          </span>
          <Badge tone={PRIORITY_TONE[task.priority]}>{PRIORITY_MAP[task.priority].label} priority</Badge>
          {task.dueDate && (
            <span className={overdue ? 'font-medium text-red-600 dark:text-red-400' : ''}>
              {overdue ? 'Overdue · was due ' : 'Due '}{formatShortDate(task.dueDate)}
            </span>
          )}
        </div>

        <fieldset>
          <legend className="label">Status</legend>
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
            {STATUSES.map((s) => (
              <label
                key={s.id}
                className={`cursor-pointer rounded-md px-2 py-1.5 text-center text-xs font-medium transition-colors sm:text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-indigo-500 ${
                  draft.status === s.id
                    ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-950 dark:text-zinc-50'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                <input type="radio" name="status" value={s.id} checked={draft.status === s.id} onChange={update('status')} className="sr-only" />
                {s.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="detail-url" className="label">{category.urlLabel}</label>
          <div className="flex gap-2">
            <input
              id="detail-url"
              type="url"
              value={draft.url}
              onChange={update('url')}
              placeholder="https://"
              className={`input ${urlError ? 'input-error' : ''}`}
              aria-invalid={Boolean(urlError)}
              aria-describedby={urlError ? 'detail-url-error' : undefined}
            />
            {isValidUrl(draft.url.trim()) && (
              <a href={draft.url.trim()} target="_blank" rel="noreferrer" className="btn-secondary px-2.5" aria-label="Open link in new tab">
                <ExternalLink className="size-4" />
              </a>
            )}
          </div>
          {urlError && <p id="detail-url-error" className="field-error">{urlError}</p>}
        </div>

        <div>
          <label htmlFor="detail-notes" className="label">{category.notesLabel}</label>
          <textarea id="detail-notes" rows={4} value={draft.notes} onChange={update('notes')} className="textarea" placeholder="Key points, approach, commands, edge cases…" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="detail-learned" className="label">What I learned</label>
            <textarea id="detail-learned" rows={3} value={draft.learned} onChange={update('learned')} className="textarea" placeholder="One or two takeaways" />
          </div>
          <div>
            <label htmlFor="detail-revise" className="label">Concepts to revise</label>
            <textarea id="detail-revise" rows={3} value={draft.revise} onChange={update('revise')} className="textarea" placeholder="What still feels shaky?" />
          </div>
        </div>
      </div>
    </Modal>
  );
}
