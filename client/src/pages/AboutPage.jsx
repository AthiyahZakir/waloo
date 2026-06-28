import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import about1 from '../assets/about1.jpg';
import about2 from '../assets/about2.jpg';
import about3 from '../assets/about3.jpg';
import about4 from '../assets/about4.jpg';
import about5 from '../assets/about5.jpg';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--color-bg)', fontFamily: 'DM Sans, sans-serif' }}>

      {/* Hero */}
      <section style={{
        background: 'var(--color-yellow)',
        borderTop: 'var(--border-thick)',
        borderBottom: 'var(--border-thick)',
        padding: '80px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '20px',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'var(--color-bg)',
          border: 'var(--border-thick)',
          borderRadius: 'var(--radius-pin)',
          boxShadow: 'var(--shadow-sticker)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Logo size={44} />
        </div>
        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(32px, 5vw, 56px)',
          fontWeight: 700,
          margin: 0,
          color: 'var(--color-ink)',
          maxWidth: '700px',
          lineHeight: 1.1,
        }}>
          Because nature calls everywhere.
        </h1>
        <p style={{
          fontSize: '18px',
          color: 'var(--color-ink)',
          maxWidth: '520px',
          margin: 0,
          lineHeight: 1.6,
        }}>
          WaLoo is a community-powered washroom map — built for travellers, for people with medical needs, and for anyone who has ever been caught in an unfamiliar city, desperate.
        </p>
        <button
          className="waloo-btn"
          onClick={() => navigate('/map')}
          style={{ marginTop: '8px', fontSize: '15px', padding: '12px 24px' }}
        >
          Find a washroom now
        </button>
      </section>

      {/* Mission */}
      <section style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '80px 40px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px',
        alignItems: 'center',
      }}
        className="about-two-col"
      >
        <div>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '2px',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
          }}>
            Our Mission
          </span>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(24px, 3vw, 36px)',
            fontWeight: 700,
            margin: '12px 0 20px',
            lineHeight: 1.2,
          }}>
            A human need that the world ignores.
          </h2>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--color-text-muted)', marginBottom: '16px' }}>
            For most people, finding a washroom is a minor inconvenience. For millions of others — people living with Crohn's disease, colitis, IBS, colon cancer, or other digestive conditions — it is a daily source of anxiety, embarrassment, and genuine medical urgency.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--color-text-muted)', marginBottom: '16px' }}>
            Tourists in unfamiliar cities. Elderly travellers. Pregnant women. Parents with young children. People on long journeys through areas with no public facilities. The need is universal — but the infrastructure rarely is.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--color-text-muted)' }}>
            WaLoo exists because we believe access to clean, safe sanitation is not a luxury — it is a right. And the first step toward that right is simply knowing where to go.
          </p>
        </div>

        {/* about1 — mission image */}
        <div style={{
          border: 'var(--border-thick)',
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-sticker)',
          overflow: 'hidden',
          aspectRatio: '4/3',
        }}>
          <img src={about1} alt="Our mission" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </section>

      {/* Stats */}
      <section style={{
        background: 'var(--color-surface-grey)',
        borderTop: 'var(--border-thick)',
        borderBottom: 'var(--border-thick)',
        padding: '60px 40px',
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
        }}
          className="about-three-col"
        >
          {[
            { stat: '1 in 5', desc: 'people globally live with a chronic digestive condition that makes access to washrooms medically urgent.', bg: '#FFD6E7' },
            { stat: '3×', desc: 'more likely — tourists in unfamiliar cities struggle to find accessible washrooms compared to locals.', bg: '#E8D5F5' },
            { stat: '0', desc: 'countries have a comprehensive, up-to-date public washroom database. WaLoo is building one, together.', bg: '#AEE3FB' },
          ].map((item, i) => (
            <div key={i} className="waloo-card" style={{ background: item.bg, textAlign: 'center', padding: '32px 24px' }}>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '48px',
                fontWeight: 700,
                color: 'var(--color-ink)',
                marginBottom: '12px',
              }}>
                {item.stat}
              </div>
              <p style={{ fontSize: '14px', color: 'var(--color-ink)', margin: 0, lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '80px 40px',
        textAlign: 'center',
      }}>
        <span style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '2px',
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
        }}>
          How it works
        </span>
        <h2 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(24px, 3vw, 36px)',
          fontWeight: 700,
          margin: '12px 0 40px',
        }}>
          Simple. Community-powered. Free.
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
        }}
          className="about-three-col"
        >
          {[
            { emoji: '📍', title: 'Find', desc: 'Open the map and see washrooms near you as pins. Click any pin to see ratings, reviews, and facilities at a glance.' },
            { emoji: '⭐', title: 'Review', desc: 'Visited a washroom? Leave a star rating and a quick note. Your review helps the next person make the right call.' },
            { emoji: '➕', title: 'Contribute', desc: 'Know a washroom that is not on the map? Add it in seconds by clicking the location. Every addition helps someone.' },
          ].map((step, i) => (
            <div key={i} className="waloo-card" style={{ padding: '32px 24px', textAlign: 'left' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>{step.emoji}</div>
              <h3 style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                margin: '0 0 10px',
              }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.7 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Image Gallery — about2, about3, about4 */}
      <section style={{
        background: 'var(--color-yellow)',
        borderTop: 'var(--border-thick)',
        borderBottom: 'var(--border-thick)',
        padding: '60px 40px',
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
        }}
          className="about-three-col"
        >
          {[
            { src: about2, alt: 'Public washrooms in cities' },
            { src: about3, alt: 'Travellers on the go' },
            { src: about4, alt: 'Community contributions' },
          ].map((img, i) => (
            <div key={i} style={{
              border: 'var(--border-thick)',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-sticker)',
              overflow: 'hidden',
              aspectRatio: '4/3',
            }}>
              <img src={img.src} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </section>

      {/* UN SDGs — about5 */}
      <section style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '80px 40px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px',
        alignItems: 'center',
      }}
        className="about-two-col"
      >
        <div style={{
          border: 'var(--border-thick)',
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-sticker)',
          overflow: 'hidden',
          aspectRatio: '4/3',
        }}>
          <img src={about5} alt="Global impact" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '2px',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
          }}>
            Global Impact
          </span>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(22px, 2.5vw, 32px)',
            fontWeight: 700,
            margin: '12px 0 20px',
            lineHeight: 1.2,
          }}>
            Aligned with the UN Sustainable Development Goals.
          </h2>
          <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            WaLoo is more than an app — it is a contribution to a more equitable, accessible world. Our work directly supports four UN SDGs.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {[
              { num: 'SDG 3', name: 'Good Health & Wellbeing', bg: '#D9FBD9' },
              { num: 'SDG 6', name: 'Clean Water & Sanitation', bg: '#D6EAF8' },
              { num: 'SDG 11', name: 'Sustainable Cities', bg: '#FFD6E7' },
              { num: 'SDG 17', name: 'Partnerships for Goals', bg: '#E8D5F5' },
            ].map((sdg, i) => (
              <div key={i} style={{
                background: sdg.bg,
                border: 'var(--border-thick)',
                borderRadius: '20px',
                padding: '8px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}>
                <span style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--color-ink)',
                }}>
                  {sdg.num}
                </span>
                <span style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '12px',
                  color: 'var(--color-ink)',
                }}>
                  {sdg.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'var(--color-ink)',
        borderTop: 'var(--border-thick)',
        padding: '60px 40px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
      }}>
        <h2 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(24px, 3vw, 40px)',
          fontWeight: 700,
          color: 'var(--color-yellow)',
          margin: 0,
          maxWidth: '600px',
        }}>
          Join the community. Add a washroom today.
        </h2>
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '15px',
          color: '#FFFFFF',
          margin: 0,
          maxWidth: '480px',
          lineHeight: 1.7,
          opacity: 0.85,
        }}>
          Every washroom you add helps someone who needs it. It takes thirty seconds and makes a real difference.
        </p>
        <button
          className="waloo-btn"
          onClick={() => navigate('/map')}
          style={{ fontSize: '15px', padding: '12px 28px' }}
        >
          Open the map
        </button>
      </section>

    </div>
  );
}