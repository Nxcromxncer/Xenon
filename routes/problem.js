const express = require('express');
const {
  createProblem,
  assignProblemToCompetition
} = require('../controllers/problem');

const router = express.Router();

router.post('/', createProblem);
router.post('/assign', assignProblemToCompetition);

module.exports = router;