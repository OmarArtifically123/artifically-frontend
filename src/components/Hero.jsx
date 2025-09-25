// src/components/Hero.jsx - Enhanced with Dark Mode
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Hero() {
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

  const scrollToMarketplace = () => {
    const el = document.getElementById("marketplace");
    if (el) {
      const header = document.querySelector('.site-header');
      const headerHeight = header ? header.offsetHeight : 80;
      
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight - 20;
      
      const startPosition = window.pageYOffset;
      const distance = offsetPosition - startPosition;
      const duration = 1000;
      let start = null;

      function smoothScrollStep(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const progressPercentage = Math.min(progress / duration, 1);
        
        const ease = progressPercentage < 0.5 
          ? 4 * progressPercentage * progressPercentage * progressPercentage
          : 1 - Math.pow(-2 * progressPercentage + 2, 3) / 2;
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (progress < duration) {
          requestAnimationFrame(smoothScrollStep);
        }
      }
      
      requestAnimationFrame(smoothScrollStep);
    }
  };

  return (
    <section 
      className="hero"
      style={{
        padding: "8rem 0 6rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        background: darkMode
          ? 'radial-gradient(circle at 30% 40%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)'
          : 'radial-gradient(circle at 30% 40%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: darkMode 
          ? 'conic-gradient(from 0deg, transparent, rgba(99, 102, 241, 0.1), transparent)'
          : 'conic-gradient(from 0deg, transparent, rgba(99, 102, 241, 0.05), transparent)',
        animation: 'rotate 20s linear infinite',
        opacity: darkMode ? 0.7 : 0.4
      }} />

      <div className="container">
        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 4rem)',
          fontWeight: '900',
          letterSpacing: '-0.02em',
          lineHeight: '1.1',
          marginBottom: '2rem',
          background: darkMode
            ? 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #a5b4fc 100%)'
            : 'linear-gradient(135deg, #1e293b 0%, #475569 50%, #6366f1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          position: 'relative',
          zIndex: 1
        }}>
          Deploy Enterprise AI Automations in Minutes
        </h1>
        
        <p style={{
          fontSize: '1.25rem',
          color: darkMode ? '#cbd5e1' : '#64748b',
          maxWidth: '700px',
          margin: '0 auto 2.5rem',
          lineHeight: '1.7',
          position: 'relative',
          zIndex: 1
        }}>
          Transform your business operations with battle-tested AI automations. 
          From AI receptionists to lead scoring systems—choose, configure, and deploy 
          in under 10 minutes. No complex workflows, just results.
        </p>

        <div 
          className="hero-ctas"
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '2.5rem',
            position: 'relative',
            zIndex: 1
          }}
        >
          <button 
            onClick={scrollToMarketplace} 
            className="btn"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #5855eb 100%)',
              color: '#ffffff',
              padding: '0.875rem 2rem',
              border: 'none',
              borderRadius: '0.75rem',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: darkMode 
                ? '0 4px 20px rgba(99, 102, 241, 0.4)' 
                : '0 4px 20px rgba(99, 102, 241, 0.3)',
              transform: 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = darkMode 
                ? '0 8px 30px rgba(99, 102, 241, 0.5)' 
                : '0 8px 30px rgba(99, 102, 241, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = darkMode 
                ? '0 4px 20px rgba(99, 102, 241, 0.4)' 
                : '0 4px 20px rgba(99, 102, 241, 0.3)';
            }}
          >
            Explore Marketplace
          </button>
          
          <Link 
            to="/docs" 
            className="btn"
            style={{
              background: darkMode 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.05)',
              color: darkMode ? '#ffffff' : '#1e293b',
              padding: '0.875rem 2rem',
              border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
              borderRadius: '0.75rem',
              fontWeight: '500',
              fontSize: '1rem',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)',
              transform: 'translateY(0)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = darkMode 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.1)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.borderColor = darkMode ? 'rgba(148, 163, 184, 0.4)' : 'rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = darkMode 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.05)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.borderColor = darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)';
            }}
          >
            View Documentation
          </Link>
        </div>

        <div 
          className="hero-badges"
          style={{
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            fontSize: '0.875rem',
            color: darkMode ? '#94a3b8' : '#64748b',
            position: 'relative',
            zIndex: 1
          }}
        >
          {[
            { icon: '⚡', text: 'Deploy in minutes' },
            { icon: '🔒', text: 'Enterprise security' },
            { icon: '📊', text: 'Transparent pricing' },
            { icon: '🚀', text: 'Scale infinitely' }
          ].map((badge, index) => (
            <span 
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: darkMode 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.8)',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.background = darkMode 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(255, 255, 255, 0.9)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.background = darkMode 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.8)';
              }}
            >
              <span style={{ fontSize: '1rem' }}>{badge.icon}</span>
              {badge.text}
            </span>
          ))}
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}