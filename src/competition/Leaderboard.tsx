import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

type Team = {
  name: string;
  problemsSolved: number;
  lastSolved: string;
  score: number;
};

const Leaderboard = () => {
  const { roomId } = useParams();
  const [teams, setTeams] = useState<Team[]>([
    {
      name: "Team Alpha",
      problemsSolved: 3,
      lastSolved: "2 min ago",
      score: 300,
    },
    {
      name: "Team Beta",
      problemsSolved: 2,
      lastSolved: "5 min ago",
      score: 200,
    },
    {
      name: "Team Gamma",
      problemsSolved: 1,
      lastSolved: "10 min ago",
      score: 100,
    },
  ]);

  // In real app, would fetch updates periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate live updates
      setTeams((prev) => [...prev]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="leaderboard">
      <h2>Leaderboard - Room {roomId}</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Team</th>
            <th>Problems Solved</th>
            <th>Last Solved</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{team.name}</td>
              <td>{team.problemsSolved}</td>
              <td>{team.lastSolved}</td>
              <td>{team.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
