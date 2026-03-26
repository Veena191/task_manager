import { useState } from 'react';
import { deleteTask, updateTask } from '../services/api';
import toast from 'react-hot-toast';
import { format, isPast, parseISO } from 'date-fns';
const priorityConfig = {
  High: { label: 'High', cls: 'badge-high', dot: '#ff6b6b' },
  Medium: { label: 'Medium', cls: 'badge-medium', dot: '#ffa53a' },
  Low: { label: 'Low', cls: 'badge-low', dot: '#00d4aa' }
};
const statusConfig = {
  'Todo': { label: 'Todo', cls: 'badge-todo' },
  'In Progress': { label: 'In Progress', cls: 'badge-inprogress' },
  'Done': { label: 'Done', cls: 'badge-done' }
};
export default function TaskCard({ task, onEdit, onDeleted, onUpdated }) {
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && task.status !== 'Done';
  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setDeleting(true);
    try {
      await deleteTask(task._id);
      toast.success('Task deleted');
      onDeleted(task._id);
    } catch {
      toast.error('Failed to delete task');
    } finally {
      setDeleting(false);
    }
  };

  const toggleDone = async () => {
    setToggling(true);
    try {
      const newStatus = task.status === 'Done' ? 'Todo' : 'Done';
      const res = await updateTask(task._id, { status: newStatus });
      onUpdated(res.data.task);
      toast.success(newStatus === 'Done' ? 'Marked as done! ✅' : 'Marked as todo');
    } catch {
      toast.error('Failed to update task');
    } finally {
      setToggling(false);
    }
  };

  const p = priorityConfig[task.priority] || priorityConfig.Medium;
  const s = statusConfig[task.status] || statusConfig.Todo;

  return (
    <div className="card fade-in" style={{
      display: 'flex', flexDirection: 'column', gap: '0.9rem',
      opacity: task.status === 'Done' ? 0.7 : 1,
      borderLeft: `3px solid ${p.dot}`,
      transition: 'transform 0.2s ease, opacity 0.2s ease',
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', flex: 1 }}>
          {/* Checkbox */}
          <button
            onClick={toggleDone}
            disabled={toggling}
            style={{
              width: 20, height: 20, borderRadius: 5, flexShrink: 0, marginTop: 2,
              background: task.status === 'Done' ? 'var(--done)' : 'transparent',
              border: `2px solid ${task.status === 'Done' ? 'var(--done)' : 'var(--border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '0.7rem', transition: 'all 0.2s ease'
            }}
          >
            {task.status === 'Done' && '✓'}
          </button>

          <h3 style={{
            fontSize: '0.95rem', fontWeight: 600,
            textDecoration: task.status === 'Done' ? 'line-through' : 'none',
            color: task.status === 'Done' ? 'var(--text3)' : 'var(--text)',
            lineHeight: 1.4
          }}>
            {task.title}
          </h3>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
          <button
            onClick={() => onEdit(task)}
            style={{
              width: 28, height: 28, borderRadius: 6,
              background: 'var(--bg3)', border: '1px solid var(--border)',
              color: 'var(--text2)', fontSize: '0.75rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            title="Edit"
          >✏️</button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              width: 28, height: 28, borderRadius: 6,
              background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)',
              color: 'var(--high)', fontSize: '0.75rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            title="Delete"
          >🗑️</button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p style={{ fontSize: '0.83rem', color: 'var(--text2)', lineHeight: 1.5 }}>
          {task.description}
        </p>
      )}

      {/* Badges + Due date */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span className={`badge ${s.cls}`}>{s.label}</span>
          <span className={`badge ${p.cls}`}>{p.label}</span>
        </div>

        {task.dueDate && (
          <span style={{
            fontSize: '0.75rem', fontWeight: 500,
            color: isOverdue ? 'var(--high)' : 'var(--text3)',
            display: 'flex', alignItems: 'center', gap: '0.25rem'
          }}>
            {isOverdue ? '🔥' : '📅'}
            {format(parseISO(task.dueDate), 'MMM d, yyyy')}
          </span>
        )}
      </div>
    </div>
  );
}
