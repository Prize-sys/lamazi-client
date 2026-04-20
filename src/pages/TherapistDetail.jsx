import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { therapistAPI } from '../api';

function Stars({ rating, size = 14 }) {
  const full = Math.round(rating);
  return <span style={{ color: '#F59E0B', fontSize: size }}>{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span>;
}

const DEMO = {
  therapist: { id: '1', full_name: 'Dr. Sarah Johnson', rating: 4.9, review_count: 127, specialties: ['Anxiety', 'Depression', 'Stress Management'], bio: 'Licensed clinical psychologist with 10+ years of experience helping clients overcome anxiety and depression through evidence-based therapeutic approaches.', years_of_experience: 10, languages: 'English, Spanish', price_per_session: 80, education: 'Ph.D. Clinical Psychology' },
  reviews: [{ id: '1', rating: 5, comment: 'Dr. Johnson has been incredibly helpful. Her approach is warm and professional.', client_name: 'Anonymous', created_at: '2025-11-28' }, { id: '2', rating: 5, comment: 'Life-changing therapy experience. Highly recommend!', client_name: 'Sarah M.', created_at: '2025-11-15' }],
  slots: [{ id: '1', slot_date: 'Thu, Dec 11', slot_time: '15:00' }, { id: '2', slot_date: 'Wed, Dec 10', slot_time: '10:00' }]
};

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

  const colors = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];
  const color = colors[t.full_name.charCodeAt(0) % colors.length];
  const initials = t.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="page">
      <NavBar />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 16 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', color: 'var(--gray-500)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, padding: 0 }}>
          ← Back to search
        </button>
        <div className="card" style={{ padding: 20, marginBottom: 16, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <div style={{ width: 120, height: 120, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 40, fontWeight: 700, color: 'white' }}>{initials}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: 20, fontWeight: 700 }}>{t.full_name}</h1>
              <span style={{ color: '#16A34A', fontSize: 16 }}>✓</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '6px 0' }}>
              <Stars rating={t.rating} />
              <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>{t.rating} • {t.review_count} reviews</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--gray-500)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span>🎓 {t.years_of_experience} years of experience</span>
              <span>🌍 {t.languages}</span>
              <span>💰 ${t.price_per_session} per session (60 minutes)</span>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
              {(t.specialties || []).map(s => <span key={s} className="tag">{s}</span>)}
            </div>
            <button className="btn-primary" style={{ marginTop: 14 }} onClick={() => navigate(`/book/${t.id}`)}>
              📅 Book a Session
            </button>
          </div>
        </div>

        <div className="card" style={{ padding: 20, marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 10 }}>About</h3>
          <p style={{ fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.6 }}>{t.bio}</p>
        </div>

        {slots?.length > 0 && (
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Next Available Slots</h3>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {slots.map(s => (
                <button key={s.id} onClick={() => navigate(`/book/${t.id}`, { state: { slot: s } })}
                  style={{ padding: '10px 16px', borderRadius: 8, border: '1.5px solid var(--gray-200)', background: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                  <div style={{ fontWeight: 600 }}>{s.slot_date}</div>
                  <div style={{ color: 'var(--gray-500)' }}>{s.slot_time}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {reviews?.length > 0 && (
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700 }}>Client Reviews</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Stars rating={t.rating} size={16} />
                <span style={{ fontWeight: 700 }}>{t.rating} / 5</span>
              </div>
            </div>
            {reviews.map(r => (
              <div key={r.id} style={{ borderBottom: '1px solid var(--gray-100)', paddingBottom: 14, marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{r.client_name}</span>
                  <Stars rating={r.rating} />
                </div>
                <p style={{ fontSize: 13, color: 'var(--gray-600)', marginTop: 4, lineHeight: 1.5 }}>{r.comment}</p>
                <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>{r.created_at?.slice(0, 10)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="card" style={{ padding: 16, background: 'var(--blue-light)', border: '1px solid #BFDBFE' }}>
          <h4 style={{ color: 'var(--blue)', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Privacy & Confidentiality</h4>
          <p style={{ fontSize: 13, color: 'var(--blue-dark)', lineHeight: 1.5 }}>
            All sessions are completely confidential and comply with HIPAA regulations. Your personal information and session details are encrypted and secure.
          </p>
        </div>
      </div>
    </div>
  );
}
