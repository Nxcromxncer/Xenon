import { useNavigate, Outlet } from "react-router-dom";
import "../styles.css";

const Home = () => {
  const navigate = useNavigate();

  // Dummy data for live competitions/rooms
  const liveRooms = [
    {
      id: 1,
      name: "Web Security Fundamentals",
      players: 24,
      difficulty: "Easy",
      category: "Web",
      timeLeft: "2h 15m",
    },
    {
      id: 2,
      name: "CTF Challenge: Crypto",
      players: 12,
      difficulty: "Medium",
      category: "Cryptography",
      timeLeft: "1h 30m",
    },
    {
      id: 3,
      name: "Network Pentesting",
      players: 8,
      difficulty: "Hard",
      category: "Networking",
      timeLeft: "3h 45m",
    },
    {
      id: 4,
      name: "Forensics Investigation",
      players: 16,
      difficulty: "Medium",
      category: "Forensics",
      timeLeft: "45m",
    },
  ];

  return (
    <div className="home-container">
      <div className="button-group">
        <button className="home-btn" onClick={() => navigate("/home/join")}>
          Join
        </button>
        <button className="home-btn" onClick={() => navigate("/home/create")}>
          Create
        </button>
      </div>

      <div className="nested-content">
        <Outlet />
      </div>

      {/* Live Rooms Section */}
      <div className="live-rooms-section">
        <h2 className="section-title">Live Competitions</h2>
        <div className="rooms-grid">
          {liveRooms.map((room) => (
            <div key={room.id} className="room-card">
              <div className="room-header">
                <h3>{room.name}</h3>
                <span className={`difficulty ${room.difficulty.toLowerCase()}`}>
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
              <button className="join-room-btn">Join Room</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
