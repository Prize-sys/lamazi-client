import React from 'react';
import NavBar from '../components/NavBar';

const RESOURCES = [
  { name: 'National Suicide Prevention Lifeline', desc: '24/7 free and confidential support for people in distress', contact: '988', type: 'phone' },
  { name: 'Crisis Text Line', desc: 'Free, 24/7 support via text message', contact: 'Text HOME to 741741', type: 'text' },
  { name: 'SAMHSA National Helpline', desc: 'Treatment referral and information service for mental health', contact: '1-800-662-4357', type: 'phone' },
  { name: 'Domestic Violence Hotline', desc: '24/7 support for domestic violence victims', contact: '1-800-799-7233', type: 'phone' },
  { name: 'Veterans Crisis Line', desc: 'Support for veterans and their families', contact: '1-800-273-8255', type: 'phone' },
  { name: 'LGBTQ+ Youth Support (Trevor)', desc: 'Crisis intervention for LGBTQ+ young people', contact: '1-866-488-7386', type: 'phone' },
];

export default function Help() {
  return (
    <div className="page">
      <NavBar />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 16 }}>
        <div className="card" style={{ padding: 20, marginBottom: 20, background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
            <span style={{ fontSize: 24 }}>❤️</span>
            <div>
              <h2 style={{ color: '#DC2626', fontWeight: 700, fontSize: 17, marginBottom: 4 }}>You Are Not Alone</h2>
              <p style={{ fontSize: 14, color: '#7F1D1D', lineHeight: 1.5 }}>If you are in immediate danger or experiencing a mental health crisis, please contact emergency services or use one of the resources below.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a href="tel:988" style={{ flex: 1, background: '#DC2626', color: 'white', padding: '12px 0', borderRadius: 8, textAlign: 'center', fontWeight: 700, fontSize: 14, display: 'block' }}>📞 Call 988 - Crisis Lifeline</a>
            <a href="tel:911" style={{ flex: 1, background: '#111827', color: 'white', padding: '12px 0', borderRadius: 8, textAlign: 'center', fontWeight: 700, fontSize: 14, display: 'block' }}>📞 Call 911 - Emergency</a>
          </div>
        </div>

        <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Crisis & Support Resources</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {RESOURCES.map((r, i) => (
            <div key={i} className="card" style={{ padding: 14 }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 18, background: 'var(--red-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>📞</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 2 }}>{r.desc}</div>
                </div>
              </div>
              <a href={r.type === 'phone' ? `tel:${r.contact.replace(/[^0-9]/g, '')}` : '#'} style={{ color: 'var(--blue)', fontWeight: 700, fontSize: 13 }}>{r.contact}</a>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 18 }}>🌐</span>
            <h3 style={{ fontWeight: 700 }}>Online Resources</h3>
          </div>
          {[['NAMI - National Alliance on Mental Illness', 'Education, support, and advocacy for mental health'], ['MentalHealth.gov', 'Information and resources from the U.S. government'], ['Psychology Today', 'Find therapists, articles, and mental health information']].map(([name, desc]) => (
            <div key={name} style={{ padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{desc}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 16, background: 'var(--blue-light)', border: '1px solid #BFDBFE' }}>
          <h4 style={{ color: 'var(--blue)', fontWeight: 700, marginBottom: 10 }}>When to Seek Immediate Help</h4>
          {['Thinking about hurting yourself or others', 'Feeling hopeless or having no reason to live', 'Experiencing unbearable emotional or physical pain', 'Seeing or hearing things that aren\'t there', 'Feeling out of control or unable to cope'].map(item => (
            <div key={item} style={{ fontSize: 13, color: 'var(--blue-dark)', marginBottom: 6 }}>• {item}</div>
          ))}
          <p style={{ fontSize: 13, color: 'var(--blue)', fontWeight: 600, marginTop: 12 }}>Remember: Reaching out for help is a sign of strength, not weakness.</p>
        </div>
      </div>
    </div>
  );
}
