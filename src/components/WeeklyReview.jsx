import { useState } from 'react';
import { Check } from 'lucide-react';

export const EMPTY_REVIEW = { learned: '', revise: '', challenge: '', confidence: 0, notes: '', updatedAt: null };

const REVIEW_FIELDS = ['learned', 'revise', 'challenge', 'confidence', 'notes'];
const CONFIDENCE_LABELS = ['Very low', 'Low', 'Okay', 'Good', 'Interview ready'];

/** Validator for useLocalStorage: keeps only known fields with the right types. */
export function sanitizeReview(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const text = (v) => (typeof v === 'string' ? v : '');
  const confidence = Number.isInteger(value.confidence) && value.confidence >= 0 && value.confidence <= 5 ? value.confidence : 0;
  return {
    learned: text(value.learned),
    revise: text(value.revise),
    challenge: text(value.challenge),
    confidence,
    notes: text(value.notes),
    updatedAt: Number.isFinite(value.updatedAt) ? value.updatedAt : null,
  };
}

function TextField({ id, label, hint, value, onChange, rows = 3 }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <textarea id={id} rows={rows} value={value} onChange={onChange} placeholder={hint} className="textarea" />
    </div>
  );
}

export default function WeeklyReview({ review, onSave }) {
  const [draft, setDraft] = useState(review);
  const isDirty = REVIEW_FIELDS.some((key) => draft[key] !== review[key]);
  const update = (key) => (event) => setDraft((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const saved = { ...draft, updatedAt: Date.now() };
    setDraft(saved);
    onSave(saved);
  };

  const savedLabel = review.updatedAt
    ? `Last saved ${new Date(review.updatedAt).toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' })}`
    : 'Not saved yet';

  return (
    <section className="card" aria-labelledby="review-title">
      <div className="border-b border-zinc-200 p-5 dark:border-zinc-800">
        <h2 id="review-title" className="text-sm font-semibold">Weekly review</h2>
        <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">Reflect before Saturday. Honest notes make next week’s plan easier.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 p-5">
        <div className="grid gap-5 md:grid-cols-2">
          <TextField id="review-learned" label="What I learned this week" hint="Patterns, commands, concepts…" value={draft.learned} onChange={update('learned')} />
          <TextField id="review-revise" label="Topics I need to revise" hint="Sliding window, git rebase, useMemo…" value={draft.revise} onChange={update('revise')} />
          <TextField id="review-challenge" label="Biggest challenge" hint="What slowed you down?" value={draft.challenge} onChange={update('challenge')} />
          <fieldset>
            <legend className="label">My confidence level</legend>
            <div className="grid grid-cols-5 gap-1.5">
              {CONFIDENCE_LABELS.map((label, index) => {
                const level = index + 1;
                const selected = draft.confidence === level;
                return (
                  <label
                    key={level}
                    title={label}
                    className={`flex h-10 cursor-pointer items-center justify-center rounded-lg border text-sm font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-indigo-500 ${
                      selected
                        ? 'border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500'
                        : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="confidence"
                      value={level}
                      checked={selected}
                      onChange={() => setDraft((prev) => ({ ...prev, confidence: level }))}
                      className="sr-only"
                      aria-label={`${level} – ${label}`}
                    />
                    {level}
                  </label>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              {draft.confidence ? `${draft.confidence}/5 · ${CONFIDENCE_LABELS[draft.confidence - 1]}` : 'Pick a level from 1 (very low) to 5 (interview ready).'}
            </p>
          </fieldset>
        </div>
        <TextField id="review-notes" label="Weekly self-review notes" hint="Anything else worth remembering…" value={draft.notes} onChange={update('notes')} rows={4} />

        <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {isDirty ? 'You have unsaved changes' : (
              <span className="inline-flex items-center gap-1">
                {review.updatedAt && <Check className="size-3.5 text-emerald-500" aria-hidden="true" />}
                {savedLabel}
              </span>
            )}
          </p>
          <div className="flex gap-2">
            <button type="button" className="btn-secondary flex-1 sm:flex-none" onClick={() => setDraft(review)} disabled={!isDirty}>Discard</button>
            <button type="submit" className="btn-primary flex-1 sm:flex-none" disabled={!isDirty}>Save review</button>
          </div>
        </div>
      </form>
    </section>
  );
}
