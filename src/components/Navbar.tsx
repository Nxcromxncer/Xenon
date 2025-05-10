import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-logo">
          XENON
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            Log Out
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
