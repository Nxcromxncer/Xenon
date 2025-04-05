import { useState, useEffect } from "react";

interface Team {
  id: string;
  name: string;
  solvedProblems: number;
  lastSolved: string;
}

const Leaderboard = ({ roomId }: { roomId: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching leaderboard data
  useEffect(() => {
    if (!isVisible) return;

    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch this from your backend
        // const response = await fetch(`/api/rooms/${roomId}/leaderboard`);
        // const data = await response.json();

        // Mock data - replace with actual API call
        const mockData: Team[] = [
          {
            id: "1",
            name: "Team Alpha",
            solvedProblems: 3,
            lastSolved: "2 min ago",
          },
          {
            id: "2",
            name: "Team Beta",
            solvedProblems: 2,
            lastSolved: "5 min ago",
          },
          {
            id: "3",
            name: "Team Gamma",
            solvedProblems: 1,
            lastSolved: "10 min ago",
          },
          {
            id: "4",
            name: "Team Delta",
            solvedProblems: 0,
            lastSolved: "Never",
          },
        ];

        setTeams(mockData);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();

    // Set up polling for live updates (every 10 seconds)
    const intervalId = setInterval(fetchLeaderboard, 10000);

    return () => clearInterval(intervalId);
  }, [isVisible, roomId]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <>
      {/* Leaderboard Link */}
      <button onClick={toggleVisibility} className="leaderboard-link">
        View Leaderboard
      </button>

      {/* Leaderboard Modal */}
      {isVisible && (
        <div className="leaderboard-modal" onClick={toggleVisibility}>
          <div
            className="leaderboard-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="leaderboard-header">
              <h3>Live Leaderboard</h3>
              <button onClick={toggleVisibility} className="close-button">
                &times;
              </button>
            </div>

            {isLoading ? (
              <div className="loading-message">Loading leaderboard...</div>
            ) : (
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Team</th>
                    <th>Solved</th>
                    <th>Last Solved</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team, index) => (
                    <tr key={team.id}>
                      <td>{index + 1}</td>
                      <td>{team.name}</td>
                      <td>{team.solvedProblems}</td>
                      <td>{team.lastSolved}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Leaderboard;
