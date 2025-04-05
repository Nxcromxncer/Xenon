import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { socket } from "./utils/socket";

type ExecutionStatus = "success" | "failed" | "error";

interface ExecutionResult {
  status: ExecutionStatus;
  message: string;
  output?: string;
  error?: string;
  executionTime?: number;
}

interface TestCase {
  input: string;
  expectedOutput: string;
  hidden: boolean;
}

interface CodeExecutorProps {
  initialCode?: string;
  problemId?: string;
  competitionMode?: boolean;
  onResult?: (result: ExecutionResult) => void;
}

const CodeExecutor: React.FC<CodeExecutorProps> = ({
  initialCode = "",
  problemId,
  competitionMode = false,
  onResult,
}) => {
  const { roomId } = useParams<{ roomId: string }>();
  const [code, setCode] = useState(initialCode);
  const [languageId, setLanguageId] = useState<number>(71); // Default: Python
  const [customInput, setCustomInput] = useState("");
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [results, setResults] = useState<ExecutionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [executionCount, setExecutionCount] = useState(0);
  const [lastExecution, setLastExecution] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const languages = [
    { id: 71, name: "Python 3" },
    { id: 54, name: "C++" },
    { id: 63, name: "JavaScript (Node.js)" },
    { id: 62, name: "Java" },
  ];

  useEffect(() => {
    if (!problemId) return;

    const fetchTestCases = async () => {
      try {
        // Replace with actual API call
        const mockTestCases: TestCase[] = [
          { input: "1\n2", expectedOutput: "3", hidden: false },
          { input: "5\n5", expectedOutput: "10", hidden: false },
          { input: "10\n-3", expectedOutput: "7", hidden: true },
        ];
        setTestCases(mockTestCases);
      } catch (err) {
        setError("Failed to load test cases");
        console.error("Test case loading error:", err);
      }
    };

    fetchTestCases();
  }, [problemId]);

  const executeCode = async (
    input: string,
    expectedOutput: string
  ): Promise<ExecutionResult> => {
    const startTime = performance.now();

    try {
      // Replace with actual Judge0 API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

      // Mock response - replace with real API response handling
      const mockOutput = "3"; // Simulated output
      const executionTime = performance.now() - startTime;

      return {
        status: mockOutput === expectedOutput ? "success" : "failed",
        message:
          mockOutput === expectedOutput
            ? "✅ Test Passed"
            : "❌ Output Mismatch",
        output: mockOutput,
        executionTime,
      };
    } catch (err) {
      const executionTime = performance.now() - startTime;
      return {
        status: "error",
        message: "❌ Runtime Error",
        error: (err as Error).message || "Unknown error occurred",
        executionTime,
      };
    }
  };

  const executeAllTests = async () => {
    if (competitionMode) {
      const now = Date.now();
      if (now - lastExecution < 2000) {
        setError("Please wait 2 seconds between executions");
        return;
      }
      if (executionCount >= 5) {
        setError("Maximum 5 executions allowed in competition mode");
        return;
      }
      setLastExecution(now);
      setExecutionCount((prev) => prev + 1);
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const executionResults: ExecutionResult[] = [];

      // Run visible test cases
      for (const testCase of testCases.filter((tc) => !tc.hidden)) {
        const result = await executeCode(
          testCase.input,
          testCase.expectedOutput
        );
        executionResults.push(result);
        setResults((prev) => [...prev, result]);
      }

      // Run hidden tests in competition mode
      if (competitionMode) {
        const hiddenResults = await Promise.all(
          testCases
            .filter((tc) => tc.hidden)
            .map((tc) => executeCode(tc.input, tc.expectedOutput))
        );
        executionResults.push(...hiddenResults);
      }

      const passedCount = executionResults.filter(
        (r) => r.status === "success"
      ).length;
      const totalTests = executionResults.length;
      const totalTime = executionResults.reduce(
        (sum, r) => sum + (r.executionTime || 0),
        0
      );

      const finalResult: ExecutionResult = {
        status: passedCount === totalTests ? "success" : "failed",
        message:
          passedCount === totalTests
            ? "🎉 All tests passed!"
            : `Passed ${passedCount}/${totalTests} tests`,
        executionTime: totalTime,
      };

      setResults((prev) => [...prev, finalResult]);
      onResult?.(finalResult);

      // Broadcast result via socket
      if (roomId && problemId) {
        socket.emit("execution_result", {
          roomId,
          problemId,
          result: finalResult,
        });
      }
    } catch (err) {
      setError("Failed to execute tests");
      console.error("Execution error:", err);
    } finally {
      setLoading(false);
    }
  };

  const runCustomTest = async () => {
    if (!customInput.trim()) {
      setError("Please provide input for custom test");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await executeCode(customInput, "");
      setResults([result]);
    } catch (err) {
      setError("Custom test failed");
      console.error("Custom test error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="code-executor">
      <div className="executor-header">
        <h3>Code Executor</h3>
        <select
          value={languageId}
          onChange={(e) => setLanguageId(Number(e.target.value))}
          disabled={competitionMode}
        >
          {languages.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div className="execution-controls">
        <button
          onClick={executeAllTests}
          disabled={loading || testCases.length === 0}
        >
          {loading ? "Running..." : "Run Tests"}
        </button>

        {competitionMode && (
          <div className="execution-count">Attempts: {executionCount}/5</div>
        )}
      </div>

      <div className="custom-test-section">
        <h4>Custom Test</h4>
        <textarea
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Enter custom input..."
          disabled={loading}
        />
        <button onClick={runCustomTest} disabled={loading}>
          Run Custom Test
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="execution-results">
        <h4>Test Results</h4>
        {results.length > 0 ? (
          <div className="results-list">
            {results.map((result, index) => (
              <div key={index} className={`result ${result.status}`}>
                <div className="result-header">
                  <strong>{result.message}</strong>
                  {result.executionTime && (
                    <span> ({result.executionTime.toFixed(0)}ms)</span>
                  )}
                </div>
                {result.output && (
                  <div className="result-output">
                    <span>Output:</span>
                    <pre>{result.output}</pre>
                  </div>
                )}
                {result.error && (
                  <div className="result-error">
                    <span>Error:</span>
                    <pre>{result.error}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No results yet. Run some tests!</p>
        )}
      </div>
    </div>
  );
};

export default CodeExecutor;
