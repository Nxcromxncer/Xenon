const { db } = require('../config/firebase');

module.exports = {
  collection: 'users',
  schema: {
    uid: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String },
    teamId: { type: String, default: null },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  },

  createUser: async (userData) => {
    const userRef = db.collection('users').doc(userData.uid);
    await userRef.set(userData);
    return userRef.id;
  },

  findById: async (uid) => {
    const doc = await db.collection('users').doc(uid).get();
    return doc.exists ? doc.data() : null;
  }
};