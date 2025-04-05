const express = require('express');
const authRoutes = require('./auth');
const teamRoutes = require('./team');
const competitionRoutes = require('./compitition');
const problemRoutes = require('./problem');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/teams', teamRoutes);
router.use('/competitions', competitionRoutes);
router.use('/problems', problemRoutes);

module.exports = router;