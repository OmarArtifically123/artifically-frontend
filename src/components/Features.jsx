// src/components/Features.jsx - Enhanced with Dark Mode
import { useState, useEffect } from "react";

export default function Features() {
  const [darkMode, setDarkMode] = useState(true);

  // Get theme from document
  useEffect(() => {
    const theme = document.documentElement.getAttribute('data-theme');
    setDarkMode(theme === 'dark' || theme === null);
    
    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setDarkMode(currentTheme === 'dark' || currentTheme === null);
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
    
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: "🛒",
      title: "Marketplace, Not a Builder",
      desc: "Choose from battle-tested automations built by experts. No complex flow building or configuration nightmares."
    },
    {
      icon: "🔗",
      title: "Enterprise Integrations", 
      desc: "Seamlessly connects with Stripe, HubSpot, Shopify, Slack, WhatsApp, and 50+ business tools out of the box."
    },
    {
      icon: "🛡️",
      title: "Military-Grade Security",
      desc: "SOC 2 compliant with zero-trust architecture, end-to-end encryption, and granular permission controls."
    },
    {
      icon: "⚡",
      title: "Lightning Deployment",
      desc: "From selection to production in under 10 minutes. No coding, no complex setup, just results."
    },
    {
      icon: "📊",
      title: "Real-Time Analytics",
      desc: "Monitor performance, track ROI, and optimize operations with comprehensive dashboards and insights."
    },
    {
      icon: "🚀",
      title: "Infinite Scale",
      desc: "Built on cloud-native infrastructure that scales from startup to enterprise without breaking stride."
    }
  ];

  return (
    <section 
      className="features"
      style={{
        padding: "6rem 0",
        background: darkMode
          ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%)',
        position: 'relative',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Background pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: darkMode
          ? 'radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)'
          : 'radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)',
        animation: 'backgroundShift 15s ease-in-out infinite',
        zIndex: 1
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div 
          className="section-header"
          style={{
            textAlign: 'center',
            marginBottom: '4rem'
          }}
        >
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 2.5rem)',
            fontWeight: '800',
            marginBottom: '1rem',
            background: darkMode
              ? 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)'
              : 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Built for Modern Enterprises
          </h2>
          <p style={{
            color: darkMode ? '#94a3b8' : '#64748b',
            fontSize: '1.125rem'
          }}>
            Automations that deliver measurable ROI from day one
          </p>
        </div>

        <div 
          className="features-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}
        >
          {features.map((f, i) => (
            <div 
              className="feature-card" 
              key={i}
              style={{
                textAlign: 'center',
                padding: '2.5rem',
                background: darkMode
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(255, 255, 255, 0.8)',
                borderRadius: '1.5rem',
                border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(20px)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = darkMode ? 'rgba(148, 163, 184, 0.4)' : 'rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.boxShadow = darkMode 
                  ? '0 25px 50px rgba(0, 0, 0, 0.3)' 
                  : '0 25px 50px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Hover effect overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: darkMode
                  ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)'
                  : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
                transition: 'left 0.5s ease',
                zIndex: 1
              }} />

              <div 
                className="feature-icon"
                style={{
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '1rem',
                  background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  fontSize: '1.5rem',
                  boxShadow: darkMode 
                    ? '0 10px 25px rgba(99, 102, 241, 0.4)' 
                    : '0 10px 25px rgba(99, 102, 241, 0.3)',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                {f.icon}
              </div>
              
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                marginBottom: '0.75rem',
                color: darkMode ? '#ffffff' : '#1e293b',
                position: 'relative',
                zIndex: 2
              }}>
                {f.title}
              </h3>
              
              <p style={{
                color: darkMode ? '#94a3b8' : '#64748b',
                lineHeight: '1.6',
                position: 'relative',
                zIndex: 2
              }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes backgroundShift {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .feature-card:hover div:first-child {
          left: 100%;
        }
      `}</style>
    </section>
  );
}