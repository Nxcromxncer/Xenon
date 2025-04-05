const { db } = require('../config/firebase');

exports.createProblem = async (req, res) => {
  try {
    const { title, description, difficulty, testCases, starterCode } = req.body;
    
    // Verify admin
    if (!req.user.isAdmin) throw new Error('Unauthorized');
    
    const problemData = {
      title,
      description,
      difficulty,
      testCases,
      starterCode,
      createdAt: new Date()
    };
    
    const problemRef = await db.collection('problems').add(problemData);
    
    res.status(201).json({ problemId: problemRef.id });
  } catch (error) {
    console.error('Create problem error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.assignProblemToCompetition = async (req, res) => {
  try {
    const { competitionId, problemId, round } = req.body;
    
    // Verify admin
    if (!req.user.isAdmin) throw new Error('Unauthorized');
    
    await db.collection('competitions').doc(competitionId).update({
      problems: admin.firestore.FieldValue.arrayUnion({
        problemId,
        round
      })
    });
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Assign problem error:', error);
    res.status(400).json({ error: error.message });
  }
};