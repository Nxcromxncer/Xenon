import { useNavigate, Outlet } from "react-router-dom";
import "../styles.css";

const Home = () => {
  const navigate = useNavigate();

  const liveRooms = [
    {
      id: 1,
      name: "Python Loops Challenge",
      players: 0,
      difficulty: "Easy",
      category: "Python",
      timeLeft: "25m",
    },
    {
      id: 2,
      name: "Python Functions Mastery",
      players: 0,
      difficulty: "Medium",
      category: "Python",
      timeLeft: "35m",
    },
    {
      id: 3,
      name: "Python Data Types Drill",
      players: 0,
      difficulty: "Easy",
      category: "Python",
      timeLeft: "15m",
    },
    {
      id: 4,
      name: "Python Recursion Quest",
      players: 0,
      difficulty: "Hard",
      category: "Python",
      timeLeft: "40m",
    },
    {
      id: 5,
      name: "Python List Comprehension",
      players: 0,
      difficulty: "Medium",
      category: "Python",
      timeLeft: "30m",
    },
    {
      id: 6,
      name: "Python File Handling",
      players: 0,
      difficulty: "Easy",
      category: "Python",
      timeLeft: "20m",
    },
    {
      id: 7,
      name: "Python OOP Basics",
      players: 0,
      difficulty: "Medium",
      category: "Python",
      timeLeft: "25m",
    },
    {
      id: 8,
      name: "Python Error Handling",
      players: 0,
      difficulty: "Easy",
      category: "Python",
      timeLeft: "15m",
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
