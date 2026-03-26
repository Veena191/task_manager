import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <nav style={{
      background: 'var(--card)',
      borderBottom: '1px solid var(--border)',
      padding: '0 2rem',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(12px)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{
          width: 32, height: 32,
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem'
        }}>✓</div>
        <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>
          TaskFlow
        </span>
      </div>
      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            width: 36, height: 36,
            borderRadius: 8,
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            color: 'var(--text2)',
            fontSize: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          title="Toggle theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        {/* User info */}
        {user && (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.4rem 0.75rem',
              background: 'var(--bg3)',
              borderRadius: 8,
              border: '1px solid var(--border)'
            }}>
              <div style={{
                width: 26, height: 26,
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700, color: '#fff'
              }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text2)', fontWeight: 500 }}
                className="hide-mobile">
                {user.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.9rem', fontSize: '0.82rem' }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
