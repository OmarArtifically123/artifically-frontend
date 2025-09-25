// src/components/Footer.jsx - Enhanced Glass Morphism Footer
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Footer() {
  const [currentYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState({
    automationsDeployed: 0,
    companiesServed: 0,
    timesSaved: 0
  });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");
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

  // Animate stats on mount
  useEffect(() => {
    const animateStats = () => {
      const finalStats = {
        automationsDeployed: 1247,
        companiesServed: 356,
        timesSaved: 89420
      };

      const duration = 2000;
      const steps = 60;
      const stepTime = duration / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);

        setStats({
          automationsDeployed: Math.floor(finalStats.automationsDeployed * easeOut),
          companiesServed: Math.floor(finalStats.companiesServed * easeOut),
          timesSaved: Math.floor(finalStats.timesSaved * easeOut)
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setStats(finalStats);
        }
      }, stepTime);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateStats();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    const footerElement = document.querySelector('.site-footer');
    if (footerElement) {
      observer.observe(footerElement);
    }

    return () => observer.disconnect();
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus(''), 3000);
      return;
    }

    setNewsletterStatus('loading');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNewsletterStatus('success');
      setNewsletterEmail('');
      setTimeout(() => setNewsletterStatus(''), 5000);
    } catch (error) {
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus(''), 3000);
    }
  };

  const socialLinks = [
    { 
      name: 'Twitter', 
      url: 'https://twitter.com/artifically', 
      icon: '🐦',
      hoverColor: '#1DA1F2'
    },
    { 
      name: 'LinkedIn', 
      url: 'https://linkedin.com/company/artifically', 
      icon: '💼',
      hoverColor: '#0077B5'
    },
    { 
      name: 'GitHub', 
      url: 'https://github.com/artifically', 
      icon: '💻',
      hoverColor: darkMode ? '#ffffff' : '#333333'
    },
    { 
      name: 'Discord', 
      url: 'https://discord.gg/artifically', 
      icon: '💬',
      hoverColor: '#5865F2'
    }
  ];

  const quickStats = [
    {
      number: stats.automationsDeployed.toLocaleString(),
      label: "Automations Deployed",
      suffix: "+"
    },
    {
      number: stats.companiesServed.toLocaleString(),
      label: "Companies Served",
      suffix: "+"
    },
    {
      number: (stats.timesSaved / 1000).toFixed(1),
      label: "Hours Saved",
      suffix: "K+"
    }
  ];

  const footerSections = [
    {
      title: "Products",
      links: [
        { name: 'Marketplace', path: '/marketplace', desc: 'Browse automations' },
        { name: 'AI Receptionist', path: '/marketplace?category=receptionist', desc: 'Smart call handling' },
        { name: 'Lead Scoring', path: '/marketplace?category=sales', desc: 'Intelligent lead analysis' },
        { name: 'Analytics Engine', path: '/marketplace?category=analytics', desc: 'Business insights' },
        { name: 'Custom Solutions', path: '/contact', desc: 'Enterprise integrations' }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: 'Documentation', path: '/docs', desc: 'Complete guides' },
        { name: 'API Reference', path: '/api', desc: 'Developer resources' },
        { name: 'Pricing', path: '/pricing', desc: 'Transparent costs' },
        { name: 'Blog', path: '/blog', desc: 'Latest insights' },
        { name: 'Case Studies', path: '/cases', desc: 'Success stories' },
        { name: 'Changelog', path: '/changelog', desc: 'Product updates' }
      ]
    },
    {
      title: "Support & Legal",
      links: [
        { name: 'Help Center', path: '/help', desc: '24/7 support' },
        { name: 'Status Page', path: '/status', desc: 'System status' },
        { name: 'Security', path: '/security', desc: 'SOC 2 compliant' },
        { name: 'Privacy Policy', path: '/privacy', desc: 'Data protection' },
        { name: 'Terms of Service', path: '/terms', desc: 'Usage terms' },
        { name: 'Contact', path: '/contact', desc: 'Get in touch' }
      ]
    }
  ];

  return (
    <>
      <footer 
        className="site-footer" 
        style={{ 
          background: darkMode
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
          marginTop: '5rem',
          padding: '5rem 0 2rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: darkMode
            ? 'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)',
          animation: 'backgroundShift 20s ease-in-out infinite',
          zIndex: 1
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 2 }}>
          {/* Stats Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem',
            padding: '2rem',
            background: darkMode
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.05)',
            borderRadius: '1rem',
            border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
            backdropFilter: 'blur(20px)',
            boxShadow: darkMode
              ? '0 8px 32px rgba(0, 0, 0, 0.3)'
              : '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            {quickStats.map((stat, index) => (
              <div 
                key={stat.label}
                style={{
                  textAlign: 'center',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  background: darkMode
                    ? 'rgba(255, 255, 255, 0.02)'
                    : 'rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.background = darkMode
                    ? 'rgba(99, 102, 241, 0.1)'
                    : 'rgba(99, 102, 241, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = darkMode
                    ? 'rgba(255, 255, 255, 0.02)'
                    : 'rgba(0, 0, 0, 0.02)';
                }}
              >
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  color: darkMode ? '#a5b4fc' : '#6366f1',
                  marginBottom: '0.5rem',
                  background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {stat.number}{stat.suffix}
                </div>
                <div style={{
                  color: darkMode ? '#94a3b8' : '#64748b',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Main Footer Content */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem'
          }}>
            {/* Company Info */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                <span style={{
                  fontSize: '2rem',
                  filter: darkMode 
                    ? 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))'
                    : 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.3))'
                }}>🤖</span>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.02em'
                }}>
                  Artifically
                </h3>
              </div>
              <p style={{
                color: darkMode ? '#94a3b8' : '#64748b',
                lineHeight: '1.7',
                marginBottom: '1.5rem',
                fontSize: '0.95rem'
              }}>
                Deploy enterprise-grade AI automations in minutes. Transform your business operations with battle-tested AI solutions that scale.
              </p>
              
              {/* Social Links */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: darkMode
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.05)',
                      border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      fontSize: '1.2rem',
                      textDecoration: 'none',
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                      e.currentTarget.style.borderColor = social.hoverColor;
                      e.currentTarget.style.background = `${social.hoverColor}20`;
                      e.currentTarget.style.boxShadow = `0 8px 25px ${social.hoverColor}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.borderColor = darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.background = darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>

              {/* Newsletter Signup */}
              <div>
                <h4 style={{
                  color: darkMode ? '#ffffff' : '#1e293b',
                  marginBottom: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}>
                  Stay Updated
                </h4>
                <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="your@email.com"
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                      background: darkMode
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(255, 255, 255, 0.8)',
                      color: darkMode ? '#ffffff' : '#1e293b',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s ease',
                      backdropFilter: 'blur(10px)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#6366f1';
                      e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="submit"
                    disabled={newsletterStatus === 'loading'}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                      color: '#ffffff',
                      fontWeight: '600',
                      cursor: newsletterStatus === 'loading' ? 'not-allowed' : 'pointer',
                      opacity: newsletterStatus === 'loading' ? 0.7 : 1,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (newsletterStatus !== 'loading') {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    {newsletterStatus === 'loading' ? '...' : '→'}
                  </button>
                </form>
                {newsletterStatus && (
                  <div style={{
                    marginTop: '0.5rem',
                    fontSize: '0.75rem',
                    color: newsletterStatus === 'success' ? '#10b981' : 
                           newsletterStatus === 'error' ? '#ef4444' : (darkMode ? '#94a3b8' : '#64748b')
                  }}>
                    {newsletterStatus === 'success' && '✓ Subscribed successfully!'}
                    {newsletterStatus === 'error' && '✗ Please enter a valid email'}
                    {newsletterStatus === 'loading' && 'Subscribing...'}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Sections */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 style={{
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: darkMode ? '#ffffff' : '#1e293b',
                  fontSize: '1.1rem'
                }}>
                  {section.title}
                </h4>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {section.links.map((item) => (
                    <li key={item.name} style={{ marginBottom: '0.75rem' }}>
                      <Link
                        to={item.path}
                        style={{
                          color: darkMode ? '#94a3b8' : '#64748b',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease',
                          display: 'block',
                          padding: '0.5rem 0'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = darkMode ? '#a5b4fc' : '#6366f1';
                          e.target.style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = darkMode ? '#94a3b8' : '#64748b';
                          e.target.style.transform = 'translateX(0)';
                        }}
                      >
                        <div style={{ fontWeight: '500', color: 'inherit' }}>{item.name}</div>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          color: darkMode ? '#64748b' : '#94a3b8', 
                          marginTop: '2px' 
                        }}>
                          {item.desc}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer Bottom */}
          <div style={{
            textAlign: 'center',
            paddingTop: '2rem',
            borderTop: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
            color: darkMode ? '#64748b' : '#94a3b8',
            fontSize: '0.875rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                  animation: 'pulse 2s ease-in-out infinite'
                }} />
                <span style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>All systems operational</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>🔒</span>
                <span style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>SOC 2 Type II Certified</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>⚡</span>
                <span style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>99.9% Uptime SLA</span>
              </div>
            </div>
            
            <div>
              <p style={{ margin: 0 }}>
                © {currentYear} Artifically. All rights reserved. Built with precision for modern teams.
              </p>
              <p style={{ 
                margin: '0.5rem 0 0', 
                fontSize: '0.75rem',
                color: darkMode ? '#64748b' : '#94a3b8'
              }}>
                Empowering businesses with AI automation. Based in Abu Dhabi, UAE.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes backgroundShift {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 1;
            transform: scale(1);
          }
          50% { 
            opacity: 0.5;
            transform: scale(1.2);
          }
        }
      `}</style>
    </>
  );
}