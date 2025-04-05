const { db } = require('../config/firebase');

module.exports = {
  collection: 'problems',
  schema: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
    testCases: { type: Array, required: true },
    starterCode: { type: Object, required: true }
  },

  createProblem: async (problemData) => {
    const problemRef = await db.collection('problems').add(problemData);
    return problemRef.id;
  },

  getProblemsForRound: async (competitionId, roundNumber) => {
    const competition = await db.collection('competitions').doc(competitionId).get();
    if (!competition.exists) return [];
    
    const problemIds = competition.data().problems
      .filter(p => p.round === roundNumber)
      .map(p => p.problemId);
    
    const problems = [];
    for (const id of problemIds) {
      const doc = await db.collection('problems').doc(id).get();
      if (doc.exists) problems.push(doc.data());
    }
    
    return problems;
  }
};