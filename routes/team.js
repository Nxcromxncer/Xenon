const express = require('express');
const {
  createTeam,
  joinTeam,
  setTeamReady
} = require('../controllers/team');

const router = express.Router();

router.post('/create', createTeam);
router.post('/join', joinTeam);
router.post('/ready', setTeamReady);

module.exports = router;