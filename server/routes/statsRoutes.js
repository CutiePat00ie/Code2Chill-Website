const express = require('express');
const router = express.Router();
const { getClubStats, getDomains } = require('../controllers/statsController');

router.get('/', getClubStats);
router.get('/domains', getDomains);

module.exports = router;
