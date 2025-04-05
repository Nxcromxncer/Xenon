import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";

// Judge0 configuration
const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com";
const JUDGE0_API_KEY = "4b742a0bd0msh5ef3210484b92c0p1c8952jsn72bbffb2c7f0"; // Replace with your actual API key

const languageIds = {
  python: 71,
  javascript: 63,
  java: 62,
  "c++": 54,
};

const ProblemIDE = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  // Problem data
  const problem = {
    id: 1,
    title: "Python-Start Challenge",
    description: "Write a program that prints 'Hello World'",
    solution: "Hello World\n", // Note: Judge0 adds newline to output
    starterCode: {
      python: 'print("Hello World")',
      javascript: 'console.log("Hello World")',
      java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World");\n  }\n}',
      "c++":
        '#include <iostream>\n\nint main() {\n  std::cout << "Hello World";\n  return 0;\n}',
    },
  };

  const [code, setCode] = useState(problem.starterCode.python);
  const [language, setLanguage] = useState("python");
  const [theme, setTheme] = useState("vs-dark");
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(
      problem.starterCode[newLanguage as keyof typeof problem.starterCode] || ""
    );
  };

  const executeCode = async (isSubmission = false) => {
    setIsExecuting(true);
    setOutput("Executing...");

    try {
      // Submit code to Judge0
      const submissionResponse = await fetch(`${JUDGE0_API_URL}/submissions`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": JUDGE0_API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        body: JSON.stringify({
          source_code: code,
          language_id: languageIds[language as keyof typeof languageIds],
          stdin: "",
          expected_output: problem.solution,
          wait: true, // Wait for execution to complete
        }),
      });

      const submissionData = await submissionResponse.json();

      // Get execution results
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

      // Handle response
      if (resultData.status?.description === "Accepted") {
        setOutput(resultData.stdout || "No output");

        if (isSubmission) {
          setIsSubmitted(true);
          if (resultData.stdout === problem.solution) {
            setTimeout(() => navigate(`/competition/${roomId}/result`), 1000);
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
      {/* Problem Section */}
      <div className="problem-section">
        <h2>{problem.title}</h2>
        <div className="problem-description">
          <p>{problem.description}</p>
        </div>
      </div>

      {/* IDE Section */}
      <div className="ide-section">
        <div className="ide-controls">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            disabled={isExecuting || isSubmitted}
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="c++">C++</option>
          </select>

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
            language={language}
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

        {/* Execution Panel */}
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
                output === problem.solution
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
              {isSubmitted && output === problem.solution && (
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
