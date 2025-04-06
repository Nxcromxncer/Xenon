import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";

// Judge0 configuration
const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com";
const JUDGE0_API_KEY = "4b742a0bd0msh5ef3210484b92c0p1c8952jsn72bbffb2c7f0";

const languageId = 71; // Python language ID

// Problem data mapped to room names from Home.tsx
const problemMap: Record<string, any> = {
  "python-loops-challenge": {
    id: 1,
    title: "Python Loops Challenge",
    description:
      "Write a program that takes a number 5 and prints its multiplication table up to 10.",
    solution:
      "5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50\n",
    starterCode: "num = #Enter your number\n# Write your loop here",
    input: "5",
  },
  "python-functions-mastery": {
    id: 2,
    title: "Python Functions Mastery",
    description:
      "Write a function to check if a number is prime. The function should return True for prime numbers and False otherwise.",
    solution: "True\n",
    starterCode:
      "def is_prime(n):\n    # Write your code here\n    pass\n\nprint(is_prime(7))",
    input: "",
  },
  "python-data-types-drill": {
    id: 3,
    title: "Python Data Types Drill",
    description:
      "Given a list of numbers, create a new list containing only the unique elements sorted in ascending order.",
    solution: "[1, 2, 3, 4]\n",
    starterCode: "nums = [4, 2, 2, 3, 4, 1]\n# Write your solution here",
    input: "",
  },
  "python-recursion-quest": {
    id: 4,
    title: "Python Recursion Quest",
    description:
      "Write a recursive function to calculate the factorial of a number.",
    solution: "120\n",
    starterCode:
      "def factorial(n):\n    # Write your recursive function here\n    pass\n\nprint(factorial(5))",
    input: "",
  },
  "python-list-comprehension": {
    id: 5,
    title: "Python List Comprehension",
    description:
      "Use list comprehension to create a list of even numbers from 1 to 50.",
    solution:
      "[2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50]\n",
    starterCode: "# Write your list comprehension here",
    input: "",
  },
  "python-file-handling": {
    id: 6,
    title: "Python File Handling",
    description:
      "Write a program that writes 'Hello, World!' to a file named 'output.txt' and then reads and prints its content.",
    solution: "Hello, World!\n",
    starterCode: "# Write your file handling code here",
    input: "",
  },
  "python-oop-basics": {
    id: 7,
    title: "Python OOP Basics",
    description:
      "Create a Car class with make, model, and year attributes, and a method display_info() that prints the car details.",
    solution: "Car: Toyota Corolla (2020)\n",
    starterCode: "# Write your Car class here",
    input: "",
  },
  "python-error-handling": {
    id: 8,
    title: "Python Error Handling",
    description:
      "Write a program that takes a number as input and prints it. Handle the case where the input is not a number.",
    solution: "You entered: 42\n",
    starterCode: "# Write your error handling code here",
    input: "42",
  },
};

const ProblemIDE = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  // Get the current problem based on roomId
  const currentProblem =
    problemMap[roomId || ""] || problemMap["python-loops-challenge"];

  const [code, setCode] = useState(currentProblem.starterCode);
  const [theme, setTheme] = useState("vs-dark");
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeTaken, setTimeTaken] = useState<string>("0s");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset state when problem changes
  useEffect(() => {
    setCode(currentProblem.starterCode);
    setOutput("");
    setIsExecuting(false);
    setIsSubmitted(false);
    setStartTime(Date.now());
    setTimeTaken("0s");

    timerRef.current = setInterval(() => {
      if (startTime) {
        const seconds = Math.floor((Date.now() - startTime) / 1000);
        setTimeTaken(`${seconds}s`);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [roomId, startTime]);

  const executeCode = async (isSubmission = false) => {
    setIsExecuting(true);
    setOutput("Executing...");

    try {
      const submissionResponse = await fetch(`${JUDGE0_API_URL}/submissions`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": JUDGE0_API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        body: JSON.stringify({
          source_code: code,
          language_id: languageId,
          stdin: currentProblem.input || "",
          expected_output: currentProblem.solution,
          wait: true,
        }),
      });

      const submissionData = await submissionResponse.json();
      const resultResponse = await fetch(
        `${JUDGE0_API_URL}/submissions/${submissionData.token}?base64_encoded=false`,
        {
          headers: {
            "X-RapidAPI-Key": JUDGE0_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      const resultData = await resultResponse.json();

      if (resultData.status?.description === "Accepted") {
        setOutput(resultData.stdout || "No output");

        if (isSubmission) {
          setIsSubmitted(true);
          if (resultData.stdout === currentProblem.solution) {
            if (timerRef.current) clearInterval(timerRef.current);
            setTimeout(() => {
              navigate(`/competition/${roomId}/result`, {
                state: { timeTaken },
              });
            }, 1000);
          }
        }
      } else {
        setOutput(
          resultData.stderr ||
            resultData.compile_output ||
            resultData.status?.description ||
            "Unknown error"
        );
      }
    } catch (error) {
      setOutput(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsExecuting(false);
    }
  };

  const handleRun = () => executeCode(false);
  const handleSubmit = () => executeCode(true);

  return (
    <div className="problem-ide-container">
      <div className="problem-section">
        <h2>{currentProblem.title}</h2>
        <div className="problem-description">
          <p>{currentProblem.description}</p>
          <p className="time-taken">Time taken: {timeTaken}</p>
        </div>
      </div>

      <div className="ide-section">
        <div className="ide-controls">
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            disabled={isExecuting}
          >
            <option value="vs">Light</option>
            <option value="vs-dark">Dark</option>
            <option value="hc-black">High Contrast</option>
          </select>
        </div>

        <div className="editor-wrapper">
          <Editor
            height="50vh"
            language="python"
            theme={theme}
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              automaticLayout: true,
            }}
          />
        </div>

        <div className="execution-panel">
          <button
            onClick={handleRun}
            disabled={isExecuting}
            className="run-button"
          >
            {isExecuting ? "Running..." : "Run Code"}
          </button>

          <button
            onClick={handleSubmit}
            disabled={isExecuting || isSubmitted}
            className="submit-button"
          >
            {isSubmitted ? "Submitted" : "Submit Solution"}
          </button>

          {output && (
            <div
              className={`output-box ${
                output === currentProblem.solution
                  ? "success"
                  : output.toLowerCase().includes("error")
                  ? "error"
                  : "warning"
              }`}
            >
              <strong>
                {isSubmitted ? "Submission Result" : "Execution Output"}:
              </strong>
              <pre>{output}</pre>
              {isSubmitted && output === currentProblem.solution && (
                <div className="success-message">
                  ✓ Correct! Redirecting to results...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemIDE;
