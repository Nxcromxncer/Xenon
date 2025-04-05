const { auth, db } = require('../config/firebase');
const User = require('../models/user');

exports.googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    
    // Verify Google ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email, name } = decodedToken;
    
    // Check if user exists
    let user = await User.findById(uid);
    
    if (!user) {
      // Create new user
      const isAdmin = process.env.ADMIN_EMAILS.split(',').includes(email);
      user = {
        uid,
        email,
        name,
        isAdmin,
        createdAt: new Date()
      };
      await User.createUser(user);
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};