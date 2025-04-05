const axios = require('axios');
const { db } = require('../config/firebase');

const JUDGE0_URL = process.env.JUDGE0_URL || 'https://judge0-ce.p.rapidapi.com';


// For development/testing
const mockJudge = process.env.NODE_ENV === 'development';

// >>> INSERT THE NEW CODE HERE (REPLACE THE OLD runCode FUNCTION) <<<
exports.runCode = async (sourceCode, languageId, problemId) => {
  if (mockJudge) {
    console.log('Mocking code execution');
    return Math.random() > 0.5; // 50% chance of passing
  }

  try {
    // 1. Fetch ALL test cases for the problem
    const problemDoc = await db.collection('problems').doc(problemId).get();
    const testCases = problemDoc.data().testCases;
    if (!testCases?.length) throw new Error('No test cases found');

    // 2. Submit code for each test case
    const results = await Promise.all(
      testCases.map(testCase => 
        axios.post(`${JUDGE0_URL}/submissions`, {
          source_code: sourceCode,
          language_id: languageId,
          stdin: testCase.input,
          expected_output: testCase.output,
          cpu_time_limit: 2 // 2 seconds max per test
        }, {
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'Content-Type': 'application/json'
          }
        })
      )
    );

    // 3. Verify all outputs
    const statusChecks = results.map(res => res.data.status?.id === 3); // 3 = "Accepted"
    return statusChecks.every(passed => passed);

  } catch (error) {
    console.error('Judge0 API error:', error.response?.data || error.message);
    throw new Error('Code execution failed');
  }
};