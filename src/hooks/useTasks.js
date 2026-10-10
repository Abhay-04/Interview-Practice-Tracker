import { useCallback } from 'react';
import { STORAGE_KEYS } from '../data/constants';
import { createInitialTasks } from '../data/initialTasks';
import { createTask, sanitizeTasks } from '../utils/taskHelpers';
import { useLocalStorage } from './useLocalStorage';

/** All task state and the only functions allowed to change it. */
export function useTasks() {
  const [tasks, setTasks, corrupted] = useLocalStorage(STORAGE_KEYS.tasks, createInitialTasks, sanitizeTasks);

  const addTask = useCallback((fields) => {
    const task = createTask(fields);
    setTasks((prev) => [task, ...prev]);
    return task;
  }, [setTasks]);

  const updateTask = useCallback((id, changes) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes, updatedAt: Date.now() } : t)));
  }, [setTasks]);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, [setTasks]);

  const toggleComplete = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'completed' ? 'not-started' : 'completed', updatedAt: Date.now() }
          : t,
      ),
    );
  }, [setTasks]);

  const resetTasks = useCallback(() => setTasks(createInitialTasks()), [setTasks]);
  const clearTasks = useCallback(() => setTasks([]), [setTasks]);

  return { tasks, corrupted, addTask, updateTask, deleteTask, toggleComplete, resetTasks, clearTasks };
}
