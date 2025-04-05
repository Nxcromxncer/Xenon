import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [category, setCategory] = useState("");
  const [teamSize, setTeamSize] = useState(1);
  const [problems, setProblems] = useState([""]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const navigate = useNavigate();

  const categories = [
    "Programming",
    "WebDev",
    "DSA",
    "Cyber Security",
    "Machine Learning",
    "Others",
  ];

  const handleAddProblem = () => {
    setProblems([...problems, ""]);
  };

  const handleProblemChange = (index: number, value: string) => {
    const newProblems = [...problems];
    newProblems[index] = value;
    setProblems(newProblems);
  };

  const handleRemoveProblem = (index: number) => {
    if (problems.length > 1) {
      const newProblems = [...problems];
      newProblems.splice(index, 1);
      setProblems(newProblems);
    }
  };

  const handleCreateRoom = () => {
    if (!roomName.trim()) {
      alert("Please enter a room name");
      return;
    }

    if (!category) {
      alert("Please select a category");
      return;
    }

    const filteredProblems = problems.filter((p) => p.trim() !== "");
    if (filteredProblems.length === 0) {
      alert("Please add at least one problem");
      return;
    }

    // Navigate to the first problem in the room
    navigate(
      `/competition/${roomName.toLowerCase().replace(/\s+/g, "-")}/problem`,
      {
        state: {
          category,
          teamSize,
          problems: filteredProblems,
        },
      }
    );
  };

  return (
    <div className="room-container">
      <h2>Create a Competition Room</h2>

      <div className="form-group">
        <label>Room Name (Unique)</label>
        <input
          type="text"
          placeholder="Enter unique room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Category</label>
        <div className="dropdown">
          <div
            className="dropdown-toggle"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            {category || "Select Category"}
            <span className="arrow">▼</span>
          </div>
          {showCategoryDropdown && (
            <div className="dropdown-menu">
              {categories.map((cat) => (
                <div
                  key={cat}
                  className="dropdown-item"
                  onClick={() => {
                    setCategory(cat);
                    setShowCategoryDropdown(false);
                  }}
                >
                  {cat}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="form-group">
        <label>Team Size (1-4 players)</label>
        <select
          value={teamSize}
          onChange={(e) => setTeamSize(Number(e.target.value))}
        >
          {[1, 2, 3, 4].map((num) => (
            <option key={num} value={num}>
              {num} player{num !== 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Problems</label>
        {problems.map((problem, index) => (
          <div key={index} className="problem-input">
            <input
              type="text"
              placeholder={`Problem ${index + 1} URL or Identifier`}
              value={problem}
              onChange={(e) => handleProblemChange(index, e.target.value)}
            />
            {problems.length > 1 && (
              <button
                type="button"
                className="remove-btn"
                onClick={() => handleRemoveProblem(index)}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="add-problem-btn"
          onClick={handleAddProblem}
        >
          + Add Problem
        </button>
      </div>

      <button
        className="create-btn"
        onClick={handleCreateRoom}
        disabled={!roomName || !category}
      >
        Create Competition
      </button>
    </div>
  );
};

export default CreateRoom;
