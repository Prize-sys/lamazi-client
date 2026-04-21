import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { therapistAPI } from '../api';

function Stars({ rating, size=14 }) {
  const full = Math.round(rating||0);
  return <span style={{ color:'#F59E0B', fontSize:size }}>{'★'.repeat(full)}{'☆'.repeat(5-full)}</span>;
}

const DEMO = {
  therapist: { id:'1', full_name:'Dr. Sarah Johnson', rating:4.9, review_count:127, specialties:['Anxiety','Depression','Stress Management'], bio:'Licensed clinical psychologist with 10+ years of experience helping clients overcome anxiety and depression through evidence-based therapeutic approaches.', years_of_experience:10, languages:'English, Spanish', price_per_session:80 },
  reviews: [
    { id:'1', rating:5, comment:'Dr. Johnson has been incredibly helpful. Her approach is warm and professional, and I always feel heard in our sessions.', client_name:'Anonymous', created_at:'2025-11-28' },
    { id:'2', rating:5, comment:'Life-changing therapy experience. Highly recommend!', client_name:'Sarah M.', created_at:'2025-11-15' },
    { id:'3', rating:4, comment:'Great therapist with excellent communication skills. Very patient and understanding.', client_name:'Mike R.', created_at:'2025-11-10' },
  ],
  slots:[{ id:'1', slot_date:'Thu, Dec 11', slot_time:'15:00' },{ id:'2', slot_date:'Wed, Dec 10', slot_time:'10:00' }]
};

const AVATAR_COLORS = ['#6366F1','#EC4899','#F59E0B','#10B981','#3B82F6','#8B5CF6'];
const getColor = (name='') => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const getInitials = (name='') => name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();

export default function TherapistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    therapistAPI.get(id).then(res => setData(res.data)).catch(() => setData(DEMO)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page"><NavBar /><div className="spinner" /></div>;
  const { therapist: t, reviews, slots } = data || DEMO;
  const color = getColor(t.full_name);
  const initials = getInitials(t.full_name);

  return (
    <div className="page">
      <NavBar />
      <div style={{ maxWidth:700, margin:'0 auto', padding:16 }}>
        <button onClick={() => navigate(-1)} style={{ background:'none', color:'var(--gray-500)', fontSize:14, display:'flex', alignItems:'center', gap:6, marginBottom:16, padding:0, border:'none', cursor:'pointer' }}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:16,height:16}}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          Back to search
        </button>

        {/* Profile Card */}
        <div className="card" style={{ padding:20, marginBottom:14, display:'flex', gap:20, alignItems:'flex-start' }}>
          <div style={{ width:130, height:130, borderRadius:12, overflow:'hidden', flexShrink:0, background:color, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {t.avatar_url
              ? <img src={t.avatar_url} alt={t.full_name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
              : <span style={{fontSize:42,fontWeight:700,color:'white'}}>{initials}</span>}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
              <h1 style={{ fontSize:20, fontWeight:700 }}>{t.full_name}</h1>
              <span style={{ display:'inline-flex', alignItems:'center', gap:3, color:'#16A34A', fontSize:14 }}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:16,height:16}}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
              <Stars rating={t.rating} size={15} />
              <span style={{ fontSize:13, color:'var(--gray-500)' }}>{t.rating} • {t.review_count} reviews</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:5, marginBottom:10 }}>
              <div style={{ fontSize:13, color:'var(--gray-500)', display:'flex', alignItems:'center', gap:6 }}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:14,height:14}}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>
                {t.years_of_experience} years of experience
              </div>
              <div style={{ fontSize:13, color:'var(--gray-500)', display:'flex', alignItems:'center', gap:6 }}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:14,height:14}}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>
                {t.languages}
              </div>
              <div style={{ fontSize:13, color:'var(--gray-500)', display:'flex', alignItems:'center', gap:6 }}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:14,height:14}}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                ${t.price_per_session} per session (60 minutes)
              </div>
            </div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:14 }}>
              {(t.specialties||[]).map(s => <span key={s} className="tag">{s}</span>)}
            </div>
            <button className="btn-primary" onClick={() => navigate(`/book/${t.id}`)}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:16,height:16}}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
              Book a Session
            </button>
          </div>
        </div>

        {/* About */}
        <div className="card" style={{ padding:20, marginBottom:14 }}>
          <h3 style={{ fontWeight:700, marginBottom:10, fontSize:15 }}>About</h3>
          <p style={{ fontSize:14, color:'var(--gray-600)', lineHeight:1.65 }}>{t.bio}</p>
        </div>

        {/* Slots */}
        {slots?.length > 0 && (
          <div className="card" style={{ padding:20, marginBottom:14 }}>
            <h3 style={{ fontWeight:700, marginBottom:12, fontSize:15 }}>Next Available Slots</h3>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {slots.map(s => (
                <button key={s.id} onClick={() => navigate(`/book/${t.id}`, { state:{ slot:s } })}
                  style={{ padding:'10px 16px', borderRadius:'var(--radius-sm)', border:'1.5px solid var(--gray-200)', background:'white', fontSize:13, fontWeight:500, cursor:'pointer', transition:'all 0.15s' }}>
                  <div style={{ fontWeight:600 }}>{s.slot_date}</div>
                  <div style={{ color:'var(--gray-500)', fontSize:12 }}>{s.slot_time}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {reviews?.length > 0 && (
          <div className="card" style={{ padding:20, marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <h3 style={{ fontWeight:700, fontSize:15 }}>Client Reviews</h3>
              <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                <Stars rating={t.rating} size={16} />
                <span style={{ fontWeight:700, fontSize:13 }}>{t.rating} / 5</span>
              </div>
            </div>
            {reviews.map((r, idx) => (
              <div key={r.id} style={{ borderBottom: idx < reviews.length-1 ? '1px solid var(--gray-100)' : 'none', paddingBottom:idx < reviews.length-1 ? 14 : 0, marginBottom:idx < reviews.length-1 ? 14 : 0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
                  <span style={{ fontWeight:600, fontSize:14 }}>{r.client_name}</span>
                  <Stars rating={r.rating} size={13} />
                </div>
                <p style={{ fontSize:13, color:'var(--gray-600)', lineHeight:1.5, marginBottom:4 }}>{r.comment}</p>
                <span style={{ fontSize:11, color:'var(--gray-400)' }}>{r.created_at?.slice(0,10)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Privacy */}
        <div style={{ background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:'var(--radius)', padding:16 }}>
          <h4 style={{ color:'var(--blue)', fontSize:14, fontWeight:600, marginBottom:6 }}>Privacy & Confidentiality</h4>
          <p style={{ fontSize:13, color:'#1D4ED8', lineHeight:1.55 }}>
            All sessions are completely confidential and comply with HIPAA regulations. Your personal information and session details are encrypted and secure.
          </p>
        </div>
      </div>
    </div>
  );
}
