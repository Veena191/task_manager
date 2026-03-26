import { useState, useEffect, useCallback } from 'react';
import { getTasks } from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Analytics from '../components/Analytics';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
const TABS = ['Tasks', 'Analytics'];
export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [activeTab, setActiveTab] = useState('Tasks');
  const [analyticsKey, setAnalyticsKey] = useState(0);
  const [filters, setFilters] = useState({
    search: '', status: '', priority: '',
    sortBy: 'createdAt', order: 'desc',
    page: 1, limit: 9
  });
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      params.sortBy = filters.sortBy;
      params.order = filters.order;
      params.page = filters.page;
      params.limit = filters.limit;
      const res = await getTasks(params);
      setTasks(res.data.tasks);
      setPagination({ total: res.data.total, totalPages: res.data.totalPages });
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);
  useEffect(() => { fetchTasks(); }, [fetchTasks]);
  useEffect(() => {
    const timer = setTimeout(() => { }, 300);
    return () => clearTimeout(timer);
  }, [filters.search]);
  const handleFilter = (key, value) => {
    setFilters(f => ({ ...f, [key]: value, page: 1 }));
  };
  const handleSaved = () => {
    fetchTasks();
    setAnalyticsKey(k => k + 1);
  };
  const handleDeleted = (id) => {
    setTasks(t => t.filter(task => task._id !== id));
    setPagination(p => ({ ...p, total: p.total - 1 }));
    setAnalyticsKey(k => k + 1);
  };
  const handleUpdated = (updated) => {
    setTasks(t => t.map(task => task._id === updated._id ? updated : task));
    setAnalyticsKey(k => k + 1);
  };
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.7rem', marginBottom: '0.25rem' }}>My Workspace</h1>
            <p style={{ color: 'var(--text3)', fontSize: '0.9rem' }}>
              {pagination.total} task{pagination.total !== 1 ? 's' : ''} total
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => { setEditTask(null); setShowForm(true); }}
          >
            + New Task
          </button>
        </div>
        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '0.25rem',
          background: 'var(--bg2)', borderRadius: 10, padding: '0.25rem',
          width: 'fit-content', marginBottom: '1.5rem',
          border: '1px solid var(--border)'
        }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.45rem 1.2rem', borderRadius: 8,
                fontWeight: 600, fontSize: '0.875rem',
                background: activeTab === tab ? 'var(--accent)' : 'transparent',
                color: activeTab === tab ? '#fff' : 'var(--text3)',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === tab ? '0 2px 12px var(--accent-glow)' : 'none'
              }}>
              {tab === 'Tasks' ? '📋 ' : '📊 '}{tab}
            </button>
          ))}
        </div>
        {/* Tasks Tab */}
        {activeTab === 'Tasks' && (
          <>
            {/* Filter Bar */}
            <div style={{
              display: 'flex', gap: '0.75rem', flexWrap: 'wrap',
              marginBottom: '1.5rem', alignItems: 'center'
            }}>
              {/* Search */}
              <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem' }}>🔍</span>
                <input
                  className="form-input"
                  placeholder="Search tasks..."
                  value={filters.search}
                  onChange={e => handleFilter('search', e.target.value)}
                  style={{ paddingLeft: '2.2rem' }}
                />
              </div>
              {/* Status filter */}
              <select className="form-input" value={filters.status} onChange={e => handleFilter('status', e.target.value)}
                style={{ width: 'auto', minWidth: 130 }}>
                <option value="">All Status</option>
                <option value="Todo">📌 Todo</option>
                <option value="In Progress">⚡ In Progress</option>
                <option value="Done">✅ Done</option>
              </select>
              {/* Priority filter */}
              <select className="form-input" value={filters.priority} onChange={e => handleFilter('priority', e.target.value)}
                style={{ width: 'auto', minWidth: 140 }}>
                <option value="">All Priority</option>
                <option value="High">🔴 High</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Low">🟢 Low</option>
              </select>
              {/* Sort */}
              <select className="form-input" value={`${filters.sortBy}_${filters.order}`}
                onChange={e => {
                  const [sortBy, order] = e.target.value.split('_');
                  setFilters(f => ({ ...f, sortBy, order, page: 1 }));
                }}
                style={{ width: 'auto', minWidth: 160 }}>
                <option value="createdAt_desc">Newest First</option>
                <option value="createdAt_asc">Oldest First</option>
                <option value="dueDate_asc">Due Date ↑</option>
                <option value="dueDate_desc">Due Date ↓</option>
                <option value="priority_desc">Priority High→Low</option>
              </select>
              {/* Clear filters */}
              {(filters.search || filters.status || filters.priority) && (
                <button className="btn btn-secondary" onClick={() => setFilters(f => ({ ...f, search: '', status: '', priority: '', page: 1 }))}>
                  ✕ Clear
                </button>
              )}
            </div>
            {/* Task Grid */}
            {loading ? (
              <div className="loading-container"><div className="spinner" /></div>
            ) : tasks.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '4rem 2rem',
                color: 'var(--text3)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text2)', marginBottom: '0.5rem' }}>No tasks found</h3>
                <p style={{ fontSize: '0.875rem' }}>
                  {filters.search || filters.status || filters.priority
                    ? 'Try adjusting your filters'
                    : 'Create your first task to get started'}
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1rem'
              }}>
                {tasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={t => { setEditTask(t); setShowForm(true); }}
                    onDeleted={handleDeleted}
                    onUpdated={handleUpdated}
                  />
                ))}
              </div>
            )}
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                gap: '0.5rem', marginTop: '2rem'
              }}>
                <button
                  className="btn btn-secondary"
                  disabled={filters.page === 1}
                  onClick={() => handleFilter('page', filters.page - 1)}
                >← Prev</button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => handleFilter('page', p)}
                    style={{
                      width: 36, height: 36, borderRadius: 8, fontSize: '0.875rem',
                      fontWeight: filters.page === p ? 700 : 400,
                      background: filters.page === p ? 'var(--accent)' : 'var(--bg3)',
                      color: filters.page === p ? '#fff' : 'var(--text2)',
                      border: `1px solid ${filters.page === p ? 'var(--accent)' : 'var(--border)'}`,
                      boxShadow: filters.page === p ? '0 2px 10px var(--accent-glow)' : 'none'
                    }}
                  >{p}</button>
                ))}
                <button
                  className="btn btn-secondary"
                  disabled={filters.page === pagination.totalPages}
                  onClick={() => handleFilter('page', filters.page + 1)}
                >Next →</button>
              </div>
            )}
          </>
        )}
        {/* Analytics Tab */}
        {activeTab === 'Analytics' && <Analytics key={analyticsKey} />}
      </main>
      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          task={editTask}
          onClose={() => { setShowForm(false); setEditTask(null); }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}