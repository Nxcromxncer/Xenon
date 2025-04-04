import { useNavigate, Outlet } from "react-router-dom";
import "../styles.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="button-group">
        <button className="home-btn" onClick={() => navigate("/home/join")}>
          Join
        </button>
        <button className="home-btn" onClick={() => navigate("/home/create")}>
          Create
        </button>
        <button
          className="role-btn"
          onClick={() => alert("Role options coming soon!")}
        >
          Role
        </button>
      </div>

      <div className="nested-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
