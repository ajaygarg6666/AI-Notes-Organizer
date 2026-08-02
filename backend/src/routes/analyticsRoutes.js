const express = require('express');
const { getOverview, getWeakTopics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/overview', getOverview);
router.get('/weak-topics', getWeakTopics);

module.exports = router;
