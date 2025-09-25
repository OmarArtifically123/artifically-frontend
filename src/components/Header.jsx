import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header({ user, onSignIn, onSignUp, onSignOut }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Apply theme to document and save to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <header 
      className={`site-header ${scrolled ? 'scrolled' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: darkMode 
          ? 'rgba(15, 23, 42, 0.8)' 
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: scrolled ? '0.75rem 0' : '1rem 0',
        boxShadow: scrolled 
          ? (darkMode 
              ? '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(99, 102, 241, 0.1)' 
              : '0 4px 20px rgba(0, 0, 0, 0.1), 0 0 40px rgba(99, 102, 241, 0.05)')
          : 'none'
      }}
    >
      <div 
        className="header-inner"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
          position: 'relative'
        }}
      >
        {/* Animated Background Effect */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: darkMode
              ? 'linear-gradient(90deg, transparent 0%, rgba(99, 102, 241, 0.05) 50%, transparent 100%)'
              : 'linear-gradient(90deg, transparent 0%, rgba(99, 102, 241, 0.02) 50%, transparent 100%)',
            opacity: scrolled ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none'
          }}
        />

        {/* Brand */}
        <div 
          className="brand" 
          onClick={() => navigate("/")}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
            zIndex: 1
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span 
            className="brand-icon"
            style={{
              fontSize: '2rem',
              filter: darkMode 
                ? 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))' 
                : 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.3))',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          >
            🤖
          </span>
          <span 
            className="brand-name"
            style={{
              fontSize: '1.5rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em'
            }}
          >
            Artifically
          </span>
        </div>
        
        {/* Navigation */}
        <nav 
          className="nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            position: 'relative',
            zIndex: 1
          }}
        >
          {['marketplace', 'pricing', 'docs'].map((route) => (
            <Link
              key={route}
              to={`/${route}`}
              style={{
                color: pathname === `/${route}` 
                  ? (darkMode ? '#ffffff' : '#1e293b')
                  : (darkMode ? '#cbd5e1' : '#64748b'),
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                position: 'relative',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                background: pathname === `/${route}` 
                  ? (darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)')
                  : 'transparent',
                textTransform: 'capitalize'
              }}
              onMouseEnter={(e) => {
                if (pathname !== `/${route}`) {
                  e.target.style.color = darkMode ? '#ffffff' : '#1e293b';
                  e.target.style.background = darkMode 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.05)';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (pathname !== `/${route}`) {
                  e.target.style.color = darkMode ? '#cbd5e1' : '#64748b';
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              {route}
              {pathname === `/${route}` && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    left: '0',
                    right: '0',
                    height: '2px',
                    background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
                    borderRadius: '1px'
                  }}
                />
              )}
            </Link>
          ))}
        </nav>
        
        {/* Actions */}
        <div 
          className="header-actions"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            position: 'relative',
            zIndex: 1
          }}
        >
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              border: 'none',
              background: darkMode 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.1)',
              color: darkMode ? '#ffffff' : '#1e293b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.background = darkMode 
                ? 'rgba(255, 255, 255, 0.15)' 
                : 'rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.background = darkMode 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.1)';
            }}
            title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {!user ? (
            <>
              <button 
                className="btn btn-text" 
                onClick={onSignIn}
                style={{
                  background: 'transparent',
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = darkMode ? '#ffffff' : '#1e293b';
                  e.target.style.background = darkMode 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = darkMode ? '#cbd5e1' : '#64748b';
                  e.target.style.background = 'transparent';
                }}
              >
                Sign in
              </button>
              <button 
                className="btn btn-primary" 
                onClick={onSignUp}
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #5855eb 100%)',
                  color: '#ffffff',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)';
                }}
              >
                Get started
              </button>
            </>
          ) : (
            <>
              <span 
                className="user-chip"
                style={{
                  background: darkMode 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.05)',
                  color: darkMode ? '#ffffff' : '#1e293b',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                  backdropFilter: 'blur(10px)'
                }}
              >
                {user.businessName || user.email}
              </span>
              <button 
                className="btn btn-secondary" 
                onClick={() => navigate("/dashboard")}
                style={{
                  background: darkMode 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.05)',
                  color: darkMode ? '#ffffff' : '#1e293b',
                  padding: '0.75rem 1.5rem',
                  border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                  borderRadius: '0.5rem',
                  fontWeight: '500',
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
                Dashboard
              </button>
              <button 
                className="btn btn-text" 
                onClick={onSignOut}
                style={{
                  background: 'transparent',
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = darkMode ? '#ffffff' : '#1e293b';
                  e.target.style.background = darkMode 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = darkMode ? '#cbd5e1' : '#64748b';
                  e.target.style.background = 'transparent';
                }}
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1); 
            filter: ${darkMode 
              ? 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))' 
              : 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.3))'};
          }
          50% { 
            transform: scale(1.05); 
            filter: ${darkMode 
              ? 'drop-shadow(0 0 15px rgba(99, 102, 241, 0.7))' 
              : 'drop-shadow(0 0 15px rgba(99, 102, 241, 0.5))'};
          }
        }

        .site-header {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .site-header.scrolled {
          backdrop-filter: blur(20px) saturate(150%);
          -webkit-backdrop-filter: blur(20px) saturate(150%);
        }
      `}</style>
    </header>
  );
}