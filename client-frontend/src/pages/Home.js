import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { therapistAPI } from '../api';

function Stars({ rating }) {
  return (
    <span style={{ color: '#F59E0B', fontSize: 13 }}>
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
    </span>
  );
}

export default function Home() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadTherapists();
  }, []);

  const loadTherapists = async (q = '') => {
    setLoading(true);
    try {
      const res = await therapistAPI.list({ q });
      setTherapists(res.data.therapists || []);
    } catch {
      // Use demo data if API unavailable
      setTherapists(DEMO_THERAPISTS);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (val.length === 0 || val.length > 2) loadTherapists(val);
  };

  // Avatar fallback using initials
  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
  const getColor = (name) => colors[name.charCodeAt(0) % colors.length];

  return (
    <div className="page">
      <NavBar />
      <div className="hero">
        <h1>Find Your Perfect Therapist</h1>
        <p>Connect with verified, licensed professionals who understand your needs</p>
        <div className="search-box">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 18, height: 18, color: '#9CA3AF', flexShrink: 0 }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input placeholder="Search by name, specialty, or concern..." value={search} onChange={handleSearch} />
        </div>
      </div>

      <div style={{ padding: '16px 16px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 14, color: 'var(--gray-500)' }}>{therapists.length} therapists available</span>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="therapist-grid">
          {therapists.map(t => (
            <div key={t.id} className="card therapist-card" onClick={() => navigate(`/therapist/${t.id}`)}>
              <div className="therapist-card-img">
                {t.avatar_url ? (
                  <img src={t.avatar_url} alt={t.full_name} />
                ) : (
                  <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', background: getColor(t.full_name) }}>
                    <span style={{ fontSize: 48, fontWeight: 700, color: 'white' }}>{getInitials(t.full_name)}</span>
                  </div>
                )}
                <div style={{ position: 'absolute', top: 10, right: 10, background: '#16A34A', color: 'white', padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                  ✓ Verified
                </div>
              </div>
              <div className="therapist-card-body">
                <h3>{t.full_name}</h3>
                <div className="rating">
                  <Stars rating={t.rating} />
                  <span>{t.rating?.toFixed(1)} • {t.review_count} reviews</span>
                </div>
                <div className="tags">
                  {(t.specialties || []).slice(0, 3).map(s => (
                    <span key={s} className="tag">{s}</span>
                  ))}
                </div>
                <p style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', display: '-webkit-box' }}>{t.bio}</p>
                <div className="price">$ {t.price_per_session}/session</div>
                <button className="btn-primary" style={{ marginTop: 12 }} onClick={e => { e.stopPropagation(); navigate(`/book/${t.id}`); }}>
                  Book Session
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const DEMO_THERAPISTS = [
  { id: '10000000-0000-0000-0000-000000000001', full_name: 'Dr. Sarah Johnson', rating: 4.9, review_count: 127, specialties: ['Anxiety', 'Depression', 'Stress Management'], bio: 'Licensed clinical psychologist with 10+ years helping clients overcome anxiety and depression.', price_per_session: 80 },
  { id: '10000000-0000-0000-0000-000000000002', full_name: 'Michael Chen', rating: 4.8, review_count: 93, specialties: ['Couples Therapy', 'Relationship Issues', 'Communication'], bio: 'Experienced marriage and family therapist specializing in helping couples build stronger relationships.', price_per_session: 95 },
  { id: '10000000-0000-0000-0000-000000000003', full_name: 'Dr. Emily Rodriguez', rating: 5.0, review_count: 156, specialties: ['Trauma', 'PTSD', 'Grief Counseling'], bio: 'Trauma-informed therapist with specialized training in EMDR and somatic experiencing.', price_per_session: 110 },
];
