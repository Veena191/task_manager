import { useState, useEffect } from 'react';
import { createTask, updateTask } from '../services/api';
import toast from 'react-hot-toast';
const initialState = {
  title: '', description: '', status: 'Todo', priority: 'Medium', dueDate: ''
};
export default function TaskForm({ task, onClose, onSaved }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Todo',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
      });
    }
  }, [task]);
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    setLoading(true);
    try {
      if (task) {
        await updateTask(task._id, form);
        toast.success('Task updated!');
      } else {
        await createTask(form);
        toast.success('Task created!');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-head)' }}>
            {task ? '✏️ Edit Task' : '+ New Task'}
          </h2>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8, background: 'var(--bg3)',
            border: '1px solid var(--border)', color: 'var(--text2)', fontSize: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>×</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Title */}
          <div className="form-group">
            <label>Title *</label>
            <input
              className="form-input"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              maxLength={100}
            />
          </div>
          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-input"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add more details..."
              rows={3}
              maxLength={500}
              style={{ resize: 'vertical' }}
            />
          </div>
          {/* Status + Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Status</label>
              <select className="form-input" name="status" value={form.status} onChange={handleChange}>
                <option value="Todo">📌 Todo</option>
                <option value="In Progress">⚡ In Progress</option>
                <option value="Done">✅ Done</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select className="form-input" name="priority" value={form.priority} onChange={handleChange}>
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🔴 High</option>
              </select>
            </div>
          </div>
          {/* Due Date */}
          <div className="form-group">
            <label>Due Date</label>
            <input
              className="form-input"
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>
          {/* Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Saving...' : task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
