const express = require('express');
const {
  listCompetitions,
  getCompetitionDetails,
  submitSolution,
  startCompetition,
  endRound
} = require('../controllers/compitition');

const router = express.Router();

// Public routes
router.get('/', listCompetitions);
router.get('/:competitionId', getCompetitionDetails);
router.post('/submit', submitSolution);

// Admin routes
router.post('/start', startCompetition);
router.post('/end-round', endRound);

module.exports = router;