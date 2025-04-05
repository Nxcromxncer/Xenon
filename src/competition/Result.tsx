import { useParams, useNavigate, useLocation } from "react-router-dom";

type ProblemResult = {
  id: number;
  title: string;
  solved: boolean;
  timeTaken: string;
  attempts: number;
};

type ResultData = {
  rank: number;
  teamName: string;
  totalSolved: number;
  totalScore: number;
  problems: ProblemResult[];
};

const Result = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get timeTaken from navigation state
  const timeTaken = location.state?.timeTaken || "0s";

  // Mock data with real time from ProblemIDE
  const results: ResultData = {
    rank: 1,
    teamName: "Xenon",
    totalSolved: 1,
    totalScore: 100,
    problems: [
      {
        id: 1,
        title: "My first code",
        solved: true,
        timeTaken: timeTaken,
        attempts: 1,
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
