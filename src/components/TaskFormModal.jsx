import { useState } from 'react';
import { CATEGORIES, PRIORITIES, STATUSES } from '../data/constants';
import { getWeekRange, toISODate } from '../utils/dateHelpers';
import { validateTask } from '../utils/taskHelpers';
import Modal from './Modal';

const FORM_ID = 'task-form';

function getInitialValues(task, defaultCategory) {
  if (task) {
    const { title, category, priority, status, dueDate, url } = task;
    return { title, category, priority, status, dueDate, url };
  }
  return {
    title: '',
    category: defaultCategory || 'dsa',
    priority: 'medium',
    status: 'not-started',
    dueDate: toISODate(getWeekRange().end), // default to this Saturday's deadline
    url: '',
  };
}

function Field({ id, label, error, required, children }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label} {required && <span className="text-red-500" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && <p id={`${id}-error`} className="field-error">{error}</p>}
    </div>
  );
}

export default function TaskFormModal({ task, defaultCategory, existingTasks, onSubmit, onClose }) {
  const isEdit = Boolean(task);
  const [values, setValues] = useState(() => getInitialValues(task, defaultCategory));
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const next = { ...values, [event.target.name]: event.target.value };
    setValues(next);
    // After the first submit attempt, re-validate live so errors clear as the user fixes them.
    if (submitted) setErrors(validateTask(next, existingTasks, task?.id));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    const nextErrors = validateTask(values, existingTasks, task?.id);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSubmit({ ...values, title: values.title.trim(), url: values.url.trim() });
  };

  const inputProps = (name) => ({
    id: `task-${name}`,
    name,
    value: values[name],
    onChange: handleChange,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `task-${name}-error` : undefined,
  });

  return (
    <Modal
      title={isEdit ? 'Edit task' : 'Add task'}
      description={isEdit ? 'Update the task details below.' : 'Add a new item to this week’s preparation.'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" form={FORM_ID} className="btn-primary">{isEdit ? 'Save changes' : 'Add task'}</button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field id="task-title" label="Title" error={errors.title} required>
          <input {...inputProps('title')} className={`input ${errors.title ? 'input-error' : ''}`} placeholder="e.g. Container With Most Water" autoFocus />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="task-category" label="Category" error={errors.category} required>
            <select {...inputProps('category')} className={`input cursor-pointer ${errors.category ? 'input-error' : ''}`}>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </Field>
          <Field id="task-dueDate" label="Due date" error={errors.dueDate} required>
            <input type="date" {...inputProps('dueDate')} className={`input ${errors.dueDate ? 'input-error' : ''}`} />
          </Field>
          <Field id="task-priority" label="Priority">
            <select {...inputProps('priority')} className="input cursor-pointer">
              {PRIORITIES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </Field>
          <Field id="task-status" label="Status">
            <select {...inputProps('status')} className="input cursor-pointer">
              {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </Field>
        </div>

        <Field id="task-url" label="Link (optional)" error={errors.url}>
          <input type="url" {...inputProps('url')} className={`input ${errors.url ? 'input-error' : ''}`} placeholder="https://leetcode.com/submissions/…" />
        </Field>
      </form>
    </Modal>
  );
}
