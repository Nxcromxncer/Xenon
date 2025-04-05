const { db } = require('../config/firebase');
const Team = require('../models/team');
const User = require('../models/user');
const { generateJoinCode } = require('../utils/helpers');

exports.createTeam = async (req, res) => {
  try {
    const { userId, competitionId, teamName } = req.body;
    
    // Verify user exists and isn't already in a team
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    if (user.teamId) throw new Error('User already in a team');
    
    // Create team
    const joinCode = generateJoinCode();
    const teamData = {
      name: teamName,
      competitionId,
      joinCode,
      members: [userId],
      isReady: false,
      createdAt: new Date()
    };
    
    const teamId = await Team.createTeam(teamData);
    
    // Update user's teamId
    await db.collection('users').doc(userId).update({ teamId });
    
    res.status(201).json({ teamId, joinCode });
  } catch (error) {
    console.error('Team creation error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.joinTeam = async (req, res) => {
  try {
    const { userId, joinCode } = req.body;
    
    // Verify user exists and isn't already in a team
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    if (user.teamId) throw new Error('User already in a team');
    
    // Find team by join code
    const team = await Team.findByJoinCode(joinCode);
    if (!team) throw new Error('Invalid join code');
    if (team.members.length >= 4) throw new Error('Team is full');
    
    // Add user to team
    await db.collection('teams').doc(team.id).update({
      members: [...team.members, userId]
    });
    
    // Update user's teamId
    await db.collection('users').doc(userId).update({ teamId: team.id });
    
    res.status(200).json({ teamId: team.id });
  } catch (error) {
    console.error('Team join error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.setTeamReady = async (req, res) => {
  try {
    const { teamId } = req.body;
    
    await db.collection('teams').doc(teamId).update({ isReady: true });
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Set team ready error:', error);
    res.status(400).json({ error: error.message });
  }
};