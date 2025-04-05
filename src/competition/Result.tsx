import { useParams, useNavigate } from "react-router-dom";

type Result = {
  rank: number;
  teamName: string;
  totalSolved: number;
  totalScore: number;
  problems: {
    id: number;
    title: string;
    solved: boolean;
    timeTaken: string;
    attempts: number;
  }[];
};

const Result = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  // Mock data
  const results: Result = {
    rank: 1,
    teamName: "Team Awesome",
    totalSolved: 3,
    totalScore: 300,
    problems: [
      {
        id: 1,
        title: "Two Sum",
        solved: true,
        timeTaken: "15:30",
        attempts: 1,
      },
      {
        id: 2,
        title: "Binary Search",
        solved: true,
        timeTaken: "25:10",
        attempts: 2,
      },
      {
        id: 3,
        title: "Graph Traversal",
        solved: true,
        timeTaken: "40:20",
        attempts: 3,
      },
      {
        id: 4,
        title: "Dynamic Programming",
        solved: false,
        timeTaken: "-",
        attempts: 5,
      },
    ],
  };

  const handleBackToHome = () => {
    navigate("/home");
  };

  return (
    <div className="results-view">
      <h2>Final Results - Room {roomId}</h2>

      <div className="summary">
        <h3>Your Team: {results.teamName}</h3>
        <p>Rank: {results.rank}</p>
        <p>Problems Solved: {results.totalSolved}/4</p>
        <p>Total Score: {results.totalScore}</p>
      </div>

      <div className="detailed-results">
        <h3>Problem Breakdown:</h3>
        <table>
          <thead>
            <tr>
              <th>Problem</th>
              <th>Status</th>
              <th>Time Taken</th>
              <th>Attempts</th>
            </tr>
          </thead>
          <tbody>
            {results.problems.map((problem) => (
              <tr key={problem.id}>
                <td>{problem.title}</td>
                <td className={problem.solved ? "solved" : "unsolved"}>
                  {problem.solved ? "✓" : "✗"}
                </td>
                <td>{problem.timeTaken}</td>
                <td>{problem.attempts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="action-buttons">
        <button onClick={handleBackToHome} className="home-button">
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Result;
