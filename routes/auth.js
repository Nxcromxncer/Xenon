const express = require('express');
const { googleAuth } = require('../controllers/auth');

const router = express.Router();

router.post('/google', googleAuth);

module.exports = router;