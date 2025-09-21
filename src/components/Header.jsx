import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Header({ user, onSignIn, onSignUp, onSignOut }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand" onClick={() => navigate("/")}>
          <span className="brand-icon">🤖</span>
          <span className="brand-name">Artifically</span>
        </div>
        
        <nav className="nav">
          <Link 
            to="/marketplace" 
            className={pathname === "/marketplace" ? "active" : ""}
          >
            Marketplace
          </Link>
          <Link 
            to="/pricing" 
            className={pathname === "/pricing" ? "active" : ""}
          >
            Pricing
          </Link>
          <Link 
            to="/docs" 
            className={pathname === "/docs" ? "active" : ""}
          >
            Docs
          </Link>
        </nav>
        
        <div className="header-actions">
          {!user ? (
            <>
              <button className="btn btn-text" onClick={onSignIn}>
                Sign in
              </button>
              <button className="btn btn-primary" onClick={onSignUp}>
                Get started
              </button>
            </>
          ) : (
            <>
              <span className="user-chip">
                {user.businessName || user.email}
              </span>
              <button 
                className="btn btn-secondary" 
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </button>
              <button className="btn btn-text" onClick={onSignOut}>
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}