import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-logo">
          XENON
        </Link>
        <div className="navbar-links">
          <Link to="/profile" className="navbar-link">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
