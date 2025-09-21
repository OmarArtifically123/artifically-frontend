// src/components/Footer.jsx - THE BEST FOOTER OF ALL TIME
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Footer() {
  const [currentYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState({
    automationsDeployed: 15420,
    companiesServed: 2847,
    timesSaved: 98234
  });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");

  // Animate stats on mount
  useEffect(() => {
    const animateStats = () => {
      const startStats = {
        automationsDeployed: 0,
        companiesServed: 0,
        timesSaved: 0
      };
      
      const finalStats = {
        automationsDeployed: 15420,
        companiesServed: 2847,
        timesSaved: 98234
      };

      const duration = 2000; // 2 seconds
      const steps = 60; // 60 FPS
      const stepTime = duration / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3); // Ease out cubic

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

    // Trigger animation with intersection observer
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
      // Simulate API call
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
      hoverColor: '#333'
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

  return (
    <footer className="site-footer" style={{ 
      background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
      borderTop: '1px solid var(--border-color)',
      marginTop: 'var(--space-20)',
      padding: 'var(--space-20) 0 var(--space-8)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
        animation: 'backgroundShift 20s ease-in-out infinite',
        zIndex: 1
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Stats Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-8)',
          marginBottom: 'var(--space-16)',
          padding: 'var(--space-8)',
          background: 'var(--bg-glass)',
          borderRadius: 'var(--rounded-2xl)',
          border: '1px solid var(--border-color)',
          backdropFilter: 'blur(20px)'
        }}>
          {quickStats.map((stat, index) => (
            <div 
              key={stat.label}
              style={{
                textAlign: 'center',
                padding: 'var(--space-4)',
                borderRadius: 'var(--rounded-xl)',
                background: 'rgba(255, 255, 255, 0.02)',
                transition: 'all var(--transition-normal)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
              }}
            >
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: 'var(--primary-light)',
                marginBottom: 'var(--space-2)',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {stat.number}{stat.suffix}
              </div>
              <div style={{
                color: 'var(--gray-400)',
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
        <div className="footer-content" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-12)',
          marginBottom: 'var(--space-12)'
        }}>
          {/* Company Info */}
          <div className="footer-section">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-6)'
            }}>
              <span style={{
                fontSize: '2rem',
                filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))'
              }}>🤖</span>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em'
              }}>
                Artifically
              </h3>
            </div>
            <p style={{
              color: 'var(--gray-400)',
              lineHeight: '1.7',
              marginBottom: 'var(--space-6)',
              fontSize: '0.95rem'
            }}>
              Deploy enterprise-grade AI automations in minutes. Transform your business operations with battle-tested AI solutions that scale.
            </p>
            
            {/* Social Links */}
            <div style={{
              display: 'flex',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-6)'
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
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all var(--transition-fast)',
                    fontSize: '1.2rem',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                    e.currentTarget.style.borderColor = social.hoverColor;
                    e.currentTarget.style.background = `${social.hoverColor}20`;
                    e.currentTarget.style.boxShadow = `0 8px 25px ${social.hoverColor}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.background = 'var(--bg-glass)';
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
                color: 'var(--white)',
                marginBottom: 'var(--space-3)',
                fontSize: '1rem',
                fontWeight: '600'
              }}>
                Stay Updated
              </h4>
              <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    flex: 1,
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--rounded-lg)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-glass)',
                    color: 'var(--white)',
                    fontSize: '0.875rem',
                    transition: 'all var(--transition-fast)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--rounded-lg)',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                    color: 'var(--white)',
                    fontWeight: '600',
                    cursor: newsletterStatus === 'loading' ? 'not-allowed' : 'pointer',
                    opacity: newsletterStatus === 'loading' ? 0.7 : 1,
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    if (newsletterStatus !== 'loading') {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = 'var(--shadow-lg)';
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
                  marginTop: 'var(--space-2)',
                  fontSize: '0.75rem',
                  color: newsletterStatus === 'success' ? 'var(--success)' : 
                         newsletterStatus === 'error' ? 'var(--danger)' : 'var(--gray-400)'
                }}>
                  {newsletterStatus === 'success' && '✓ Subscribed successfully!'}
                  {newsletterStatus === 'error' && '✗ Please enter a valid email'}
                  {newsletterStatus === 'loading' && 'Subscribing...'}
                </div>
              )}
            </div>
          </div>

          {/* Products */}
          <div className="footer-section">
            <h4 style={{
              fontWeight: '600',
              marginBottom: 'var(--space-4)',
              color: 'var(--white)',
              fontSize: '1.1rem'
            }}>Products</h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {[
                { name: 'Marketplace', path: '/marketplace', desc: 'Browse automations' },
                { name: 'AI Receptionist', path: '/marketplace?category=receptionist', desc: 'Smart call handling' },
                { name: 'Lead Scoring', path: '/marketplace?category=sales', desc: 'Intelligent lead analysis' },
                { name: 'Analytics Engine', path: '/marketplace?category=analytics', desc: 'Business insights' },
                { name: 'Custom Solutions', path: '/contact', desc: 'Enterprise integrations' }
              ].map((item) => (
                <li key={item.name} style={{ marginBottom: 'var(--space-3)' }}>
                  <Link
                    to={item.path}
                    style={{
                      color: 'var(--gray-400)',
                      textDecoration: 'none',
                      transition: 'all var(--transition-fast)',
                      display: 'block',
                      padding: 'var(--space-2) 0'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--primary-light)';
                      e.target.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--gray-400)';
                      e.target.style.transform = 'translateX(0)';
                    }}
                  >
                    <div style={{ fontWeight: '500', color: 'inherit' }}>{item.name}</div>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--gray-500)', 
                      marginTop: '2px' 
                    }}>
                      {item.desc}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h4 style={{
              fontWeight: '600',
              marginBottom: 'var(--space-4)',
              color: 'var(--white)',
              fontSize: '1.1rem'
            }}>Resources</h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {[
                { name: 'Documentation', path: '/docs', desc: 'Complete guides' },
                { name: 'API Reference', path: '/api', desc: 'Developer resources' },
                { name: 'Pricing', path: '/pricing', desc: 'Transparent costs' },
                { name: 'Blog', path: '/blog', desc: 'Latest insights' },
                { name: 'Case Studies', path: '/cases', desc: 'Success stories' },
                { name: 'Changelog', path: '/changelog', desc: 'Product updates' }
              ].map((item) => (
                <li key={item.name} style={{ marginBottom: 'var(--space-3)' }}>
                  <Link
                    to={item.path}
                    style={{
                      color: 'var(--gray-400)',
                      textDecoration: 'none',
                      transition: 'all var(--transition-fast)',
                      display: 'block',
                      padding: 'var(--space-2) 0'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--primary-light)';
                      e.target.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--gray-400)';
                      e.target.style.transform = 'translateX(0)';
                    }}
                  >
                    <div style={{ fontWeight: '500', color: 'inherit' }}>{item.name}</div>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--gray-500)', 
                      marginTop: '2px' 
                    }}>
                      {item.desc}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="footer-section">
            <h4 style={{
              fontWeight: '600',
              marginBottom: 'var(--space-4)',
              color: 'var(--white)',
              fontSize: '1.1rem'
            }}>Support & Legal</h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {[
                { name: 'Help Center', path: '/help', desc: '24/7 support' },
                { name: 'Status Page', path: '/status', desc: 'System status' },
                { name: 'Security', path: '/security', desc: 'SOC 2 compliant' },
                { name: 'Privacy Policy', path: '/privacy', desc: 'Data protection' },
                { name: 'Terms of Service', path: '/terms', desc: 'Usage terms' },
                { name: 'Contact', path: '/contact', desc: 'Get in touch' }
              ].map((item) => (
                <li key={item.name} style={{ marginBottom: 'var(--space-3)' }}>
                  <Link
                    to={item.path}
                    style={{
                      color: 'var(--gray-400)',
                      textDecoration: 'none',
                      transition: 'all var(--transition-fast)',
                      display: 'block',
                      padding: 'var(--space-2) 0'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--primary-light)';
                      e.target.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--gray-400)';
                      e.target.style.transform = 'translateX(0)';
                    }}
                  >
                    <div style={{ fontWeight: '500', color: 'inherit' }}>{item.name}</div>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--gray-500)', 
                      marginTop: '2px' 
                    }}>
                      {item.desc}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom" style={{
          textAlign: 'center',
          paddingTop: 'var(--space-8)',
          borderTop: '1px solid var(--border-color)',
          color: 'var(--gray-500)',
          fontSize: '0.875rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'var(--space-6)',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--success)',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
              <span style={{ color: 'var(--gray-400)' }}>All systems operational</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <span>🔒</span>
              <span style={{ color: 'var(--gray-400)' }}>SOC 2 Type II Certified</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <span>⚡</span>
              <span style={{ color: 'var(--gray-400)' }}>99.9% Uptime SLA</span>
            </div>
          </div>
          
          <div>
            <p style={{ margin: 0 }}>
              © {currentYear} Artifically. All rights reserved. Built with precision for modern teams.
            </p>
            <p style={{ 
              margin: 'var(--space-2) 0 0', 
              fontSize: '0.75rem',
              color: 'var(--gray-600)'
            }}>
              Empowering businesses with AI automation since 2024. Made with ❤️ in Abu Dhabi, UAE.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}