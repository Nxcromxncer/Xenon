import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const JoinRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const defaultRoomName = queryParams.get("room") || "";

  const [roomName, setRoomName] = useState(defaultRoomName);
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinRoom = () => {
    if (!roomName.trim()) {
      alert("Please enter a room name");
      return;
    }

    setIsJoining(true);
    navigate(`/${roomName.toLowerCase().replace(/\s+/g, "-")}/problem`);
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2>Join a Room</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleJoinRoom()}
            autoFocus
          />
        </div>
        <button
          className="primary-button"
          onClick={handleJoinRoom}
          disabled={isJoining || !roomName.trim()}
        >
          {isJoining ? (
            <>
              <span className="spinner"></span> Joining...
            </>
          ) : (
            "Join Room"
          )}
        </button>
      </div>
    </div>
  );
};

export default JoinRoom;
