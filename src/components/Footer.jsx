import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          {/* Company */}
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/docs">Documentation</Link></li>
              <li><Link to="/marketplace">Marketplace</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/api">API</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/security">Security</Link></li>
              <li><Link to="/compliance">Compliance</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/status">System Status</Link></li>
              <li><Link to="/community">Community</Link></li>
              <li><a href="mailto:support@artifically.com">Email Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Artifically. All rights reserved. Built with precision for modern teams.</p>
        </div>
      </div>
    </footer>
  );
}