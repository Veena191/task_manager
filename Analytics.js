import { useState, useEffect } from 'react';
import { getAnalytics } from '../services/api';
const StatCard = ({ label, value, icon, color, sub }) => (
  <div className="card" style={{
    display: 'flex', flexDirection: 'column', gap: '0.75rem',
    borderLeft: `3px solid ${color}`,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'default'
  }}
    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>{label}</div>
        <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-head)', color: 'var(--text)', lineHeight: 1 }}>{value}</div>
      </div>
      <div style={{
        fontSize: '1.4rem', width: 44, height: 44,
        background: `${color}18`, borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>{icon}</div>
    </div>
    {sub && <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{sub}</div>}
  </div>
);
const ProgressBar = ({ value, color, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text2)' }}>
      <span>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}%</span>
    </div>
    <div style={{ height: 8, background: 'var(--bg3)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${value}%`, background: color,
        borderRadius: 99, transition: 'width 1s ease'
      }} />
    </div>
  </div>
);
export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAnalytics();
        setData(res.data.analytics);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="loading-container"><div className="spinner" /></div>
  );
  if (!data) return null;
  const { total, completed, inProgress, todo, overdue, completionPercentage, priorityStats } = data;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-head)' }}>📊 Analytics</h2>
        <span style={{ fontSize: '0.75rem', color: 'var(--text3)', background: 'var(--bg3)', padding: '0.2rem 0.6rem', borderRadius: 99, border: '1px solid var(--border)' }}>Live</span>
      </div>
      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '1rem'
      }}>
        <StatCard label="Total Tasks" value={total} icon="📋" color="var(--accent)" />
        <StatCard label="Completed" value={completed} icon="✅" color="var(--done)" sub={`${completionPercentage}% done`} />
        <StatCard label="In Progress" value={inProgress} icon="⚡" color="var(--inprogress)" />
        <StatCard label="Todo" value={todo} icon="📌" color="var(--todo)" />
        <StatCard label="Overdue" value={overdue} icon="🔥" color="var(--high)" sub="Need attention" />
      </div>
      {/* Progress & Priority */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {/* Completion */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Completion Rate</h3>
          <ProgressBar value={completionPercentage} color="var(--accent2)" label="Overall" />
          <ProgressBar
            value={total > 0 ? Math.round((inProgress / total) * 100) : 0}
            color="var(--inprogress)" label="In Progress" />
        </div>
        {/* Priority breakdown */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Priority Breakdown</h3>
          {[
            { label: 'High', count: priorityStats.High, color: 'var(--high)' },
            { label: 'Medium', count: priorityStats.Medium, color: 'var(--medium)' },
            { label: 'Low', count: priorityStats.Low, color: 'var(--low)' },
          ].map(({ label, count, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text2)' }}>{label}</span>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{count}</span>
              <div style={{ width: 80, height: 6, background: 'var(--bg3)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: total > 0 ? `${(count / total) * 100}%` : '0%', background: color, borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
