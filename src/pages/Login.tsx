import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken(); // Get Firebase token

      const response = await fetch(
        "https:b297-2409-40d7-fd-c5af-829b-f0a7-b1f0-8cdb.ngrok-free.app/login",
        {
          // Use backend PC's IP
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      console.log("User data:", data.user); // Store in state/context
      navigate("/home");
    } catch (err) {
      setError("Failed to sign in with Google");
      console.error(err);
    }
  };

  return (
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
  );
};

export default Login;
