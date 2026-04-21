import React from 'react';
import NavBar from '../components/NavBar';

const RESOURCES = [
  { name:'National Suicide Prevention Lifeline', desc:'24/7 free and confidential support for people in distress', contact:'988', type:'phone' },
  { name:'Crisis Text Line', desc:'Free, 24/7 support via text message', contact:'Text HOME to 741741', type:'text' },
  { name:'SAMHSA National Helpline', desc:'Treatment referral and information service for mental health', contact:'1-800-662-4357', type:'phone' },
  { name:'Domestic Violence Hotline', desc:'24/7 support for domestic violence victims', contact:'1-800-799-7233', type:'phone' },
  { name:'Veterans Crisis Line', desc:'Support for veterans and their families', contact:'1-800-273-8255', type:'phone' },
  { name:'LGBTQ+ Youth Support (Trevor)', desc:'Crisis intervention for LGBTQ+ young people', contact:'1-866-488-7386', type:'phone' },
];

function PhoneIcon({ color = 'var(--red)' }) {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:16,height:16,color}}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>;
}
function ChatIcon() {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:16,height:16,color:'var(--blue)'}}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
  </svg>;
}
function GlobeIcon() {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:18,height:18,color:'var(--blue)'}}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>;
}
function HeartIcon() {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:22,height:22,color:'var(--red)'}}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>;
}

export default function Help() {
  return (
    <div className="page">
      <NavBar />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 16 }}>

        {/* Crisis Banner */}
        <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:'var(--radius)', padding:'18px 20px', marginBottom:20 }}>
          <div style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:16 }}>
            <div style={{ width:36, height:36, borderRadius:18, background:'#FEE2E2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <HeartIcon />
            </div>
            <div>
              <h2 style={{ color:'#DC2626', fontWeight:700, fontSize:16, marginBottom:4 }}>You Are Not Alone</h2>
              <p style={{ fontSize:13, color:'#7F1D1D', lineHeight:1.6 }}>If you are in immediate danger or experiencing a mental health crisis, please contact emergency services or use one of the resources below.</p>
            </div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <a href="tel:988" style={{ flex:1, background:'#DC2626', color:'white', padding:'11px 0', borderRadius:'var(--radius-sm)', textAlign:'center', fontWeight:700, fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              <PhoneIcon color="white" /> Call 988 - Crisis Lifeline
            </a>
            <a href="tel:911" style={{ flex:1, background:'#111827', color:'white', padding:'11px 0', borderRadius:'var(--radius-sm)', textAlign:'center', fontWeight:700, fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              <PhoneIcon color="white" /> Call 911 - Emergency
            </a>
          </div>
        </div>

        {/* Resources Grid */}
        <h3 style={{ fontWeight:700, marginBottom:12, fontSize:14, color:'var(--gray-700)' }}>Crisis & Support Resources</h3>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
          {RESOURCES.map((r, i) => (
            <div key={i} className="card" style={{ padding:14 }}>
              <div style={{ display:'flex', gap:10, marginBottom:8 }}>
                <div style={{ width:36, height:36, borderRadius:18, background: i===1 ? '#EFF6FF' : '#FEF2F2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {i === 1 ? <ChatIcon /> : <PhoneIcon />}
                </div>
                <div>
                  <div style={{ fontWeight:600, fontSize:12, lineHeight:1.4 }}>{r.name}</div>
                  <div style={{ fontSize:11, color:'var(--gray-400)', marginTop:2, lineHeight:1.4 }}>{r.desc}</div>
                </div>
              </div>
              <a href={r.type==='phone' ? `tel:${r.contact.replace(/[^0-9]/g,'')}` : '#'} style={{ color:'var(--blue)', fontWeight:700, fontSize:13 }}>{r.contact}</a>
            </div>
          ))}
        </div>

        {/* Online Resources */}
        <div className="card" style={{ padding:16, marginBottom:16 }}>
          <div style={{ display:'flex', gap:10, marginBottom:14, alignItems:'center' }}>
            <GlobeIcon />
            <h3 style={{ fontWeight:700, fontSize:14 }}>Online Resources</h3>
          </div>
          {[
            ['NAMI - National Alliance on Mental Illness', 'Education, support, and advocacy for mental health'],
            ['MentalHealth.gov', 'Information and resources from the U.S. government'],
            ['Psychology Today', 'Find therapists, articles, and mental health information'],
          ].map(([name, desc]) => (
            <div key={name} style={{ padding:'10px 0', borderBottom:'1px solid var(--gray-100)' }}>
              <div style={{ fontWeight:600, fontSize:14, marginBottom:2 }}>{name}</div>
              <div style={{ fontSize:12, color:'var(--gray-500)' }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* When to Seek Help */}
        <div style={{ background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:'var(--radius)', padding:16 }}>
          <h4 style={{ color:'var(--blue)', fontWeight:700, marginBottom:10, fontSize:13 }}>When to Seek Immediate Help</h4>
          {[
            'Thinking about hurting yourself or others',
            'Feeling hopeless or having no reason to live',
            'Experiencing unbearable emotional or physical pain',
            "Seeing or hearing things that aren't there",
            'Feeling out of control or unable to cope',
          ].map(item => (
            <div key={item} style={{ fontSize:13, color:'#1D4ED8', marginBottom:6 }}>• {item}</div>
          ))}
          <p style={{ fontSize:13, color:'var(--blue)', fontWeight:600, marginTop:12 }}>Remember: Reaching out for help is a sign of strength, not weakness.</p>
        </div>
      </div>
    </div>
  );
}
