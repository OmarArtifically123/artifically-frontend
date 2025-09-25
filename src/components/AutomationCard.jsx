// src/components/AutomationCard.jsx - Enhanced with Dark Mode
import { useState, useEffect } from "react";

export default function AutomationCard({ item, onDemo, onBuy }) {
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

  const formatPrice = (price, currency = "USD") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div 
      className="automation-card"
      style={{
        background: darkMode
          ? 'rgba(30, 41, 59, 0.8)'
          : 'rgba(255, 255, 255, 0.9)',
        borderRadius: '1.5rem',
        padding: '2rem',
        border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = darkMode 
          ? '0 25px 50px rgba(0, 0, 0, 0.3)' 
          : '0 25px 50px rgba(0, 0, 0, 0.15)';
        e.currentTarget.style.borderColor = darkMode ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* Gradient border effect */}
      <div style={{
        position: 'absolute',
        top: '-2px',
        left: '-2px',
        right: '-2px',
        bottom: '-2px',
        background: 'linear-gradient(135deg, #6366f1, #06b6d4, #6366f1)',
        borderRadius: '1.5rem',
        opacity: 0,
        transition: 'opacity 0.3s ease',
        zIndex: -1
      }} />

      <div 
        className="card-header"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}
      >
        <div 
          className="card-icon"
          style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '1rem',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            boxShadow: darkMode 
              ? '0 8px 20px rgba(99, 102, 241, 0.4)' 
              : '0 8px 20px rgba(99, 102, 241, 0.3)',
            filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.3))'
          }}
        >
          {item.icon}
        </div>
        
        <div 
          className="card-price"
          style={{
            background: darkMode
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.05)',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '600',
            border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
            color: darkMode ? '#a5b4fc' : '#6366f1',
            backdropFilter: 'blur(10px)'
          }}
        >
          {formatPrice(item.priceMonthly, item.currency)}/mo
        </div>
      </div>

      <h3 style={{
        fontSize: '1.125rem',
        fontWeight: '700',
        margin: '0.5rem 0 0.75rem',
        color: darkMode ? '#ffffff' : '#1e293b'
      }}>
        {item.name}
      </h3>

      <p style={{
        color: darkMode ? '#94a3b8' : '#64748b',
        marginBottom: '1.5rem',
        lineHeight: '1.6'
      }}>
        {item.description}
      </p>

      {item.tags?.length > 0 && (
        <div 
          className="card-tags"
          style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: '1.5rem'
          }}
        >
          {item.tags.map((t) => (
            <span 
              className="tag" 
              key={t}
              style={{
                background: darkMode
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.05)',
                color: darkMode ? '#cbd5e1' : '#64748b',
                padding: '0.25rem 0.75rem',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                backdropFilter: 'blur(10px)'
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div 
        className="card-actions"
        style={{
          display: 'flex',
          gap: '0.75rem'
        }}
      >
        <button 
          className="btn btn-secondary btn-small" 
          onClick={() => onDemo(item)}
          style={{
            flex: 1,
            background: darkMode
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.05)',
            color: darkMode ? '#ffffff' : '#1e293b',
            padding: '0.75rem 1rem',
            border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
            borderRadius: '0.5rem',
            fontWeight: '500',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = darkMode
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = darkMode
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.05)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Try Demo
        </button>

        <button 
          className="btn btn-primary btn-small" 
          onClick={() => onBuy(item)}
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, #6366f1 0%, #5855eb 100%)',
            color: '#ffffff',
            padding: '0.75rem 1rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '600',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: darkMode
              ? '0 4px 15px rgba(99, 102, 241, 0.4)'
              : '0 4px 15px rgba(99, 102, 241, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = darkMode
              ? '0 8px 25px rgba(99, 102, 241, 0.5)'
              : '0 8px 25px rgba(99, 102, 241, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = darkMode
              ? '0 4px 15px rgba(99, 102, 241, 0.4)'
              : '0 4px 15px rgba(99, 102, 241, 0.3)';
          }}
        >
          Buy & Deploy
        </button>
      </div>
    </div>
  );
}
