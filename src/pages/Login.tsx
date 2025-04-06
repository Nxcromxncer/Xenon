import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken(); // Get Firebase token

      const response = await fetch(
        "https://bf43-117-251-114-196.ngrok-free.app/login",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      console.log("User data:", data.user);
      navigate("/home");
    } catch (err) {
      setError("Failed to sign in with Google");
      console.error(err);
    }
  };

  return (
    <>
      {/* Internal Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            XENON
          </Link>
          <div className="navbar-links">
            <Link to="/login" className="navbar-link">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Box */}
      <div className="login-container">
        <div className="login-box">
          <h2>Login / Register</h2>
          <p>Please sign in with your Google account</p>

          <button onClick={signInWithGoogle} className="google-signin-btn">
            Sign in with Google
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default Login;
