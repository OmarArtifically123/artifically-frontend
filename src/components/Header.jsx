import { Link, NavLink } from "react-router-dom";

export default function Header({ brand, user, onLogin, onLogout, onSignup }) {
  return (
    <>
      {/* Work-in-progress banner */}
      <div className="bg-yellow-400 text-black text-center py-2 text-sm font-semibold">
        🚧 THIS IS STILL A WORK IN PROGRESS — Some features may not work yet 🚧
      </div>

      <header className="header">
        <div className="container nav">
          <Link className="logo" to="/">{brand}</Link>

          <ul className="nav-links">
            <li><NavLink to="/marketplace">Marketplace</NavLink></li>
            <li><NavLink to="/pricing">Pricing</NavLink></li>
            <li><NavLink to="/docs">Docs</NavLink></li>
          </ul>

          <div className="auth-buttons">
            {user ? (
              <>
                <Link className="btn btn-ghost" to="/dashboard">Dashboard</Link>
                <button className="btn btn-secondary" onClick={onLogout}>Sign Out</button>
              </>
            ) : (
              <>
                <button className="btn btn-ghost" onClick={onLogin}>Sign In</button>
                <button className="btn btn-primary" onClick={onSignup}>Sign Up</button>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
