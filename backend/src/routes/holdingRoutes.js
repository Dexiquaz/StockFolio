const express = require('express');
const {
  getHoldings,
  addHolding,
  updateHolding,
  deleteHolding,
  getPortfolioSummary,
  getPnL,
} = require('../controllers/holdingController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All holding routes require authentication
router.use(authMiddleware);

router.get('/', getHoldings);
router.post('/', addHolding);
router.put('/:id', updateHolding);
router.delete('/:id', deleteHolding);
router.get('/summary', getPortfolioSummary);
router.get('/pnl', getPnL);

module.exports = router;
