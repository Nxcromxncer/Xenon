const { db } = require('../config/firebase');

module.exports = {
  collection: 'teams',
  schema: {
    name: { type: String, required: true },
    members: { type: Array, default: [] },
    competitionId: { type: String, required: true },
    isReady: { type: Boolean, default: false },
    joinCode: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },

  createTeam: async (teamData) => {
    const teamRef = await db.collection('teams').add(teamData);
    return teamRef.id;
  },

  findByJoinCode: async (joinCode) => {
    const snapshot = await db.collection('teams')
      .where('joinCode', '==', joinCode)
      .limit(1)
      .get();
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }
};