import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const TeamSetup = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      setError("Please enter a team name");
      return;
    }

    setIsCreating(true);
    setError("");

    // Navigate immediately without waiting for backend response
    navigate(`/competition/${roomId}/waiting`, {
      state: {
        teamName: teamName.trim(),
        isCreator: true,
        teamId: `temp-${Date.now()}`, // Generate a temporary ID
      },
    });

    // Optionally, you can still send the request to the backend in the background
    try {
      await axios.post("http://localhost:5000/api/create", {
        roomId,
        teamName: teamName.trim(),
      });
      // You could update the state in the waiting room if needed
    } catch (error) {
      console.error("Failed to create team in backend:", error);
      // Handle error if needed (maybe show a notification)
    }

    setIsCreating(false);
  };

  const handleJoinTeam = async () => {
    if (!teamName.trim()) {
      setError("Please enter a team name");
      return;
    }

    setIsJoining(true);
    setError("");

    try {
      const checkResponse = await axios.get(
        `/api/teams/check?roomId=${roomId}&teamName=${teamName.trim()}`
      );

      if (!checkResponse.data.exists) {
        setError("Team not found in this room");
        setIsJoining(false);
        return;
      }

      const joinResponse = await axios.post("/api/teams/join", {
        roomId,
        teamName: teamName.trim(),
      });

      navigate(`/competition/${roomId}/waiting`, {
        state: {
          teamName: teamName.trim(),
          isCreator: false,
          teamId: joinResponse.data.teamId,
        },
      });
    } catch (error) {
      setError("Failed to join team");
      setIsJoining(false);
    }
  };

  return (
    <div className="team-setup-container">
      <h2>Team Setup for Room: {roomId}</h2>
      <div className="team-form">
        <input
          type="text"
          placeholder="Enter team name"
          value={teamName}
          onChange={(e) => {
            setTeamName(e.target.value);
            setError("");
          }}
        />
        {error && <div className="error-message">{error}</div>}
        <div className="button-group">
          <button
            onClick={handleCreateTeam}
            className="primary-button"
            disabled={isCreating || isJoining}
          >
            {isCreating ? "Creating..." : "Create Team"}
          </button>
          <button
            onClick={handleJoinTeam}
            className="secondary-button"
            disabled={isJoining || isCreating}
          >
            {isJoining ? "Joining..." : "Join Existing Team"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamSetup;
