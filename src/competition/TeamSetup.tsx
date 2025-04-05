import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const TeamSetup = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      alert("Please enter a team name");
      return;
    }
    navigate(`/competition/${roomId}/waiting`, {
      state: { teamName, isCreator: true },
    });
  };

  const handleJoinTeam = () => {
    if (!teamName.trim()) {
      alert("Please enter a team name");
      return;
    }
    setIsJoining(true);
    // In a real app, you would check if team exists here
    setTimeout(() => {
      navigate(`/competition/${roomId}/waiting`, {
        state: { teamName, isCreator: false },
      });
    }, 1000);
  };

  return (
    <div className="team-setup-container">
      <h2>Team Setup for {roomId}</h2>
      <div className="team-form">
        <input
          type="text"
          placeholder="Enter team name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <div className="button-group">
          <button onClick={handleCreateTeam} className="primary-button">
            Create Team
          </button>
          <button
            onClick={handleJoinTeam}
            className="secondary-button"
            disabled={isJoining}
          >
            {isJoining ? "Joining..." : "Join Existing Team"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamSetup;
