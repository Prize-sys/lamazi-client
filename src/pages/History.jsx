import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { bookingAPI } from '../api';

const DEMO_HISTORY = [
  { id:'1', therapist_name:'Dr. Sarah Johnson', session_date:'2025-12-10T00:00:00Z', session_time:'09:00', duration_minutes:60, status:'confirmed', amount:80 },
  { id:'2', therapist_name:'Michael Chen', session_date:'2025-12-11T00:00:00Z', session_time:'13:00', duration_minutes:60, status:'confirmed', amount:95 },
  { id:'3', therapist_name:'Dr. Emily Rodriguez', session_date:'2025-12-05T00:00:00Z', session_time:'14:00', duration_minutes:60, status:'completed', amount:110 },
  { id:'4', therapist_name:'Dr. Sarah Johnson', session_date:'2025-12-12T00:00:00Z', session_time:'11:00', duration_minutes:60, status:'pending', amount:80 },
];

// Formats session_date (ISO or pre-formatted string) into "Wed, 10 Dec 2025"
function formatSessionDate(dateStr) {
  if (!dateStr) return '';
  const isISO = /^\d{4}-\d{2}-\d{2}/.test(dateStr);
  const d = isISO ? new Date(dateStr) : new Date(dateStr);
  if (isNaN(d)) return dateStr; // fallback: return as-is if unparseable
  return d.toLocaleDateString('en-KE', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    timeZone: 'Africa/Nairobi'
  });
}

// Formats session_time "HH:mm" as "09:00 EAT" (24h)
function formatSessionTime(timeStr) {
  if (!timeStr) return '';
  const clean = timeStr.slice(0, 5); // "09:00"
  return `${clean} EAT`;
}

const STATUS_BADGE = { confirmed:'badge-confirmed', completed:'badge-completed', pending:'badge-pending', cancelled:'badge-cancelled' };
const STATUS_LABEL = { confirmed:'✓ Confirmed', completed:'✓ Completed', pending:'⏳ Pending', cancelled:'✕ Cancelled' };

const AVATAR_COLORS = ['#6366F1','#EC4899','#F59E0B','#10B981','#3B82F6','#8B5CF6'];
const getColor = (name='') => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const getInitials = (name='') => name.split(' ').filter(n=>n.match(/^[A-Z]/)).map(n=>n[0]).join('').slice(0,2) || name.slice(0,2).toUpperCase();

function DocIcon() {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:14,height:14}}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
}
function StarIcon() {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:14,height:14}}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>;
}

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingAPI.list()
      .then(res => setHistory(res.data.bookings || DEMO_HISTORY))
      .catch(() => setHistory(DEMO_HISTORY))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <NavBar />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: 'var(--gray-900)' }}>Session History</h2>
        <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 20 }}>{history.length} sessions</p>

        {loading ? <div className="spinner" /> : history.map(b => (
          <div key={b.id} className="card" style={{ padding: 16, marginBottom: 12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                <div style={{ width:44, height:44, borderRadius:22, background:`linear-gradient(135deg, ${getColor(b.therapist_name)}, ${getColor(b.therapist_name+'x')})`, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:12, flexShrink:0 }}>
                  {getInitials(b.therapist_name)}
                </div>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:3 }}>{b.therapist_name}</div>
                  <div style={{ fontSize:12, color:'var(--gray-500)', display:'flex', alignItems:'center', gap:4 }}>
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:12,height:12}}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                    {formatSessionDate(b.session_date)}
                  </div>
                  <div style={{ fontSize:12, color:'var(--gray-500)', display:'flex', alignItems:'center', gap:4 }}>
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:12,height:12}}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {formatSessionTime(b.session_time)} ({b.duration_minutes || 60} min)
                  </div>
                </div>
              </div>
              <span className={`badge ${STATUS_BADGE[b.status] || 'badge-pending'}`}>{STATUS_LABEL[b.status]}</span>
            </div>
            <div style={{ display:'flex', gap:8, justifyContent:'space-between', alignItems:'center', paddingTop:12, borderTop:'1px solid var(--gray-100)' }}>
              <div style={{ display:'flex', gap:8 }}>
                {b.status === 'completed' && (
                  <button className="btn-outline" style={{ fontSize:12, padding:'6px 12px', color:'var(--blue)', borderColor:'var(--blue)' }}>
                    <StarIcon /> Leave Review
                  </button>
                )}
                <button className="btn-outline" style={{ fontSize:12, padding:'6px 12px' }}><DocIcon /> Receipt</button>
              </div>
              <span style={{ fontWeight:700, fontSize:14 }}>Ksh {b.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}