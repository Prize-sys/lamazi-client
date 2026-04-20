import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function HomeIcon({ active }) {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H15.75A.75.75 0 0115 21v-5.25H9V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
  </svg>;
}
function CalIcon({ active }) {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>;
}
function HistIcon({ active }) {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>;
}
function HelpIcon({ active }) {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>;
}

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const path = location.pathname;

  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/bookings', label: 'Bookings', icon: CalIcon },
    { path: '/history', label: 'History', icon: HistIcon },
    { path: '/help', label: 'Help', icon: HelpIcon },
  ];

  return (
    <>
      <nav className="top-nav">
        <div>
          <div className="logo">LamaziSpa</div>
          <div className="logo-sub">Your journey to wellness</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="emergency-btn" onClick={() => navigate('/help')}>
            🆘 Emergency Help
          </button>
          <button onClick={logout} style={{ background: 'none', color: 'var(--gray-500)', fontSize: 13, padding: '6px 10px', borderRadius: 8, border: '1px solid var(--gray-200)' }}>
            Sign out
          </button>
        </div>
      </nav>
      <nav className="bottom-nav">
        {navItems.map(({ path: p, label, icon: Icon }) => (
          <button key={p} className={`nav-item ${path === p ? 'active' : ''}`} onClick={() => navigate(p)}>
            <Icon active={path === p} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
