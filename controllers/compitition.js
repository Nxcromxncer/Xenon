const { db } = require('../config/firebase');
const Competition = require('../models/competition');
const Team = require('../models/team');
const judge = require('../services/judge');

exports.listCompetitions = async (req, res) => {
  try {
    const competitions = await Competition.getActiveCompetitions();
    res.status(200).json(competitions);
  } catch (error) {
    console.error('List competitions error:', error);
    res.status(500).json({ error: 'Failed to fetch competitions' });
  }
};

exports.getCompetitionDetails = async (req, res) => {
  try {
    const { competitionId } = req.params;
    const doc = await db.collection('competitions').doc(competitionId).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Competition not found' });
    }
    
    res.status(200).json(doc.data());
  } catch (error) {
    console.error('Get competition error:', error);
    res.status(500).json({ error: 'Failed to fetch competition' });
  }
};

exports.submitSolution = async (req, res) => {
  try {
    const { teamId, problemId, code, languageId } = req.body;
    
    // Get current competition
    const teamDoc = await db.collection('teams').doc(teamId).get();
    if (!teamDoc.exists) throw new Error('Team not found');
    
    const competitionId = teamDoc.data().competitionId;
    const competitionDoc = await db.collection('competitions').doc(competitionId).get();
    if (!competitionDoc.exists) throw new Error('Competition not found');
    
    const currentRound = competitionDoc.data().currentRound;
    
    // Get problem details
    const problemDoc = await db.collection('problems').doc(problemId).get();
    if (!problemDoc.exists) throw new Error('Problem not found');
    
    // Run code against test cases
    const isCorrect = await judge.runCode(code, languageId, problemDoc.data().testCases);
    
    // Update team status
    const updateData = {
      lastSubmission: new Date(),
      [`round${currentRound}_attempts`]: admin.firestore.FieldValue.increment(1)
    };
    
    if (isCorrect) {
      updateData[`round${currentRound}_passed`] = true;
      updateData[`round${currentRound}_time`] = new Date();
    }
    
    await db.collection('teams').doc(teamId).update(updateData);
    
    res.status(200).json({ isCorrect });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(400).json({ error: error.message });
  }
};

// Admin-only endpoints
exports.startCompetition = async (req, res) => {
  try {
    const { competitionId } = req.body;
    
    // Verify admin
    if (!req.user.isAdmin) throw new Error('Unauthorized');
    
    await db.collection('competitions').doc(competitionId).update({
      status: 'ongoing',
      currentRound: 1,
      startTime: new Date()
    });
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Start competition error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.endRound = async (req, res) => {
  try {
    const { competitionId } = req.body;
    
    // Verify admin
    if (!req.user.isAdmin) throw new Error('Unauthorized');
    
    const competitionRef = db.collection('competitions').doc(competitionId);
    const competitionDoc = await competitionRef.get();
    
    if (!competitionDoc.exists) throw new Error('Competition not found');
    
    const currentRound = competitionDoc.data().currentRound;
    const maxRounds = competitionDoc.data().problems
      .reduce((max, p) => Math.max(max, p.round), 0);
    
    if (currentRound >= maxRounds) {
      // Competition ended
      await competitionRef.update({
        status: 'completed',
        endTime: new Date()
      });
      
      // Calculate winners
      const winners = await calculateWinners(competitionId);
      
      res.status(200).json({ 
        success: true, 
        competitionEnded: true,
        winners
      });
    } else {
      // Advance to next round
      await competitionRef.update({
        currentRound: currentRound + 1
      });
      
      res.status(200).json({ 
        success: true, 
        currentRound: currentRound + 1
      });
    }
  } catch (error) {
    console.error('End round error:', error);
    res.status(400).json({ error: error.message });
  }
};

async function calculateWinners(competitionId) {
  const teamsSnapshot = await db.collection('teams')
    .where('competitionId', '==', competitionId)
    .get();
  
  const teams = [];
  teamsSnapshot.forEach(doc => {
    teams.push({ id: doc.id, ...doc.data() });
  });
  
  // Sort by: most rounds passed, then fastest cumulative time
  const rankedTeams = teams.sort((a, b) => {
    // Count passed rounds
    const aPassed = Object.keys(a).filter(k => k.includes('_passed') && a[k]).length;
    const bPassed = Object.keys(b).filter(k => k.includes('_passed') && b[k]).length;
    
    if (bPassed !== aPassed) return bPassed - aPassed;
    
    // Calculate total time for passed rounds
    let aTime = 0, bTime = 0;
    for (let i = 1; i <= 3; i++) {
      if (a[`round${i}_passed`]) aTime += (a[`round${i}_time`]?.toMillis() || 0);
      if (b[`round${i}_passed`]) bTime += (b[`round${i}_time`]?.toMillis() || 0);
    }
    
    return aTime - bTime;
  });
  
  // Save winners
  const winners = rankedTeams.slice(0, 3).map((team, index) => ({
    position: index + 1,
    teamId: team.id,
    teamName: team.name
  }));
  
  await db.collection('competitions').doc(competitionId).update({
    winners
  });
  
  return winners;
}