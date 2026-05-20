const { Router } = require('express');
const router = Router();
const authMiddleware = require('../middleware/authMiddleware');
const { suggestTitleAndCategory, summarizePost, analyzeTone } = require('../controllers/aiController');

router.post('/suggest', authMiddleware, suggestTitleAndCategory);
router.post('/summarize', summarizePost);
router.post('/analyze-tone', authMiddleware, analyzeTone);

module.exports = router;
