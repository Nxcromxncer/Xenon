const { db } = require('../config/firebase');

module.exports = {
  collection: 'competitions',
  schema: {
    name: { type: String, required: true },
    description: { type: String },
    startTime: { type: Date },
    endTime: { type: Date },
    status: { 
      type: String, 
      enum: ['upcoming', 'registering', 'ongoing', 'completed'],
      default: 'upcoming'
    },
    currentRound: { type: Number, default: 0 },
    problems: { type: Array, default: [] }
  },

  createCompetition: async (competitionData) => {
    const compRef = await db.collection('competitions').add(competitionData);
    return compRef.id;
  },

  getActiveCompetitions: async () => {
    const snapshot = await db.collection('competitions')
      .where('status', 'in', ['registering', 'ongoing'])
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};