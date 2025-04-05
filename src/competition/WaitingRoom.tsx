import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const WaitingRoom = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { teamName, isCreator } = location.state || {};
  const [participants, setParticipants] = useState(1);
  const [countdown, setCountdown] = useState(5); // Simulated countdown

  // Simulate participants joining
  useEffect(() => {
    const interval = setInterval(() => {
      setParticipants((prev) => Math.min(prev + 1, 4));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Simulate competition start (creator only)
  useEffect(() => {
    if (isCreator) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate(`/competition/${roomId}/problem`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isCreator, navigate, roomId]);

  return (
    <div className="waiting-room-container">
      <h2>Waiting Room: {roomId}</h2>
      <div className="team-info">
        <p>
          Team: <strong>{teamName}</strong>
        </p>
        <p>Status: {isCreator ? "Creator" : "Member"}</p>
      </div>

      <div className="participants-section">
        <h3>Participants ({participants}/4)</h3>
        <div className="participants-list">
          <div className="participant">Team Member 1</div>
          {participants > 1 && <div className="participant">Team Member 2</div>}
          {participants > 2 && <div className="participant">Team Member 3</div>}
          {participants > 3 && <div className="participant">Team Member 4</div>}
        </div>
      </div>

      {isCreator ? (
        <div className="creator-controls">
          <p>Competition will start in: {countdown} seconds</p>
          <button
            onClick={() => navigate(`/competition/${roomId}/problem`)}
            className="start-button"
          >
            Start Now
          </button>
        </div>
      ) : (
        <div className="waiting-message">
          <p>Waiting for the competition to start...</p>
        </div>
      )}
    </div>
  );
};

export default WaitingRoom;
