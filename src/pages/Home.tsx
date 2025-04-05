import { useNavigate, Outlet } from "react-router-dom";
import "../styles.css";

const Home = () => {
  const navigate = useNavigate();

  const liveRooms = [
    {
      id: 1,
      name: "Python-Start",
      players: 24,
      difficulty: "Easy",
      category: "Python",
      timeLeft: "2h 15m",
    },
    {
      id: 2,
      name: "JavaScript Basics",
      players: 18,
      difficulty: "Easy",
      category: "JavaScript",
      timeLeft: "1h 30m",
    },
  ];

  return (
    <div className="home-container">
      <div className="button-group">
        <button className="home-btn" onClick={() => navigate("/home/join")}>
          Join Room
        </button>
        <button className="home-btn" onClick={() => navigate("/home/create")}>
          Create Room
        </button>
      </div>

      {window.location.pathname === "/home" ? (
        <div className="live-rooms-section">
          <h2 className="section-title">Live Competitions</h2>
          <div className="rooms-grid">
            {liveRooms.map((room) => (
              <div key={room.id} className="room-card">
                <div className="room-header">
                  <h3>{room.name}</h3>
                  <span
                    className={`difficulty ${room.difficulty.toLowerCase()}`}
                  >
                    {room.difficulty}
                  </span>
                </div>
                <div className="room-details">
                  <div className="detail">
                    <span className="label">Category:</span>
                    <span>{room.category}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Players:</span>
                    <span>{room.players} active</span>
                  </div>
                  <div className="detail">
                    <span className="label">Time Left:</span>
                    <span>{room.timeLeft}</span>
                  </div>
                </div>
                <button
                  className="join-room-btn"
                  onClick={() =>
                    navigate(
                      `/competition/${room.name
                        .toLowerCase()
                        .replace(" ", "-")}/team`
                    )
                  }
                >
                  Join Challenge
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="nested-content">
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default Home;
