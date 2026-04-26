import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { bookingAPI } from '../api';

function formatSessionDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-KE', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    timeZone: 'Africa/Nairobi'
  });
}

function formatSessionTime(timeStr) {
  if (!timeStr) return '';
  return `${timeStr.slice(0, 5)} EAT`;
}

function CalendarIcon() {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:48,height:48,color:'var(--gray-300)'}}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>;
}
function DocIcon() {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:14,height:14}}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
}

const AVATAR_COLORS = ['#6366F1','#EC4899','#F59E0B','#10B981','#3B82F6','#8B5CF6'];
const getColor = (name='') => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const getInitials = (name='') => name.split(' ').filter(n=>n.match(/^[A-Z]/)).map(n=>n[0]).join('').slice(0,2) || name.slice(0,2).toUpperCase();

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    bookingAPI.list({ status: 'confirmed' })
      .then(res => setBookings(res.data.bookings || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <NavBar />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: 'var(--gray-900)' }}>Upcoming Sessions</h2>
        <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 20 }}>{bookings.length} sessions</p>

        {loading ? <div className="spinner" /> : bookings.length === 0 ? (
          <div className="card" style={{ padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ display:'flex', justifyContent:'center', marginBottom: 12 }}><CalendarIcon /></div>
            <h3 style={{ fontWeight: 600, marginBottom: 6, color: 'var(--gray-700)' }}>No upcoming sessions</h3>
            <p style={{ color: 'var(--gray-400)', fontSize: 14 }}>Book a session with a therapist to get started</p>
          </div>
        ) : bookings.map(b => (
          <div key={b.id} className="card" style={{ padding: 16, marginBottom: 12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 12 }}>
              <div style={{ display:'flex', gap: 12, alignItems:'center' }}>
                <div style={{ width:44, height:44, borderRadius:22, background:`linear-gradient(135deg, ${getColor(b.therapist_name)}, ${getColor(b.therapist_name+'x')})`, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:13, flexShrink:0 }}>
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
              <span className="badge badge-confirmed">✓ Confirmed</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:12, borderTop:'1px solid var(--gray-100)' }}>
              <button className="btn-outline" style={{ fontSize:12, padding:'6px 12px' }}><DocIcon /> Receipt</button>
              <span style={{ fontWeight:700, fontSize:14 }}>Ksh {b.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}