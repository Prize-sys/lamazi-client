import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function HomeIcon() {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>;
}
function CalIcon() {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>;
}
function HistIcon() {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
function HelpIcon() {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>;
}
function EmergencyIcon() {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>;
}
function SignOutIcon() {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:18,height:18}}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0110.5 3h6a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0116.5 21h-6a2.25 2.25 0 01-2.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3.75" />
  </svg>;
}

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { path: '/', label: 'Home', Icon: HomeIcon },
    { path: '/bookings', label: 'Bookings', Icon: CalIcon },
    { path: '/history', label: 'History', Icon: HistIcon },
    { path: '/help', label: 'Help', Icon: HelpIcon },
  ];

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      {/* Top Nav */}
      <nav className="top-nav">
        <div>
          <div className="logo">MindCare</div>
          <div className="logo-sub">Your journey to wellness</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="emergency-btn" onClick={() => navigate('/help')}>
            <EmergencyIcon />
            Emergency Help
          </button>
          <button
            onClick={handleSignOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              background: 'transparent',
              border: '1px solid var(--gray-300, #d1d5db)',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 13,
              color: 'var(--gray-600, #4b5563)',
              fontWeight: 500,
            }}
          >
            Sign Out
            <SignOutIcon />
          </button>
        </div>
      </nav>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        {navItems.map(({ path: p, label, Icon }) => (
          <button
            key={p}
            className={`nav-item ${path === p || (p !== '/' && path.startsWith(p)) ? 'active' : ''}`}
            onClick={() => navigate(p)}
          >
            <Icon />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}