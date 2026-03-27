const prisma = require('../utils/prisma');

// GET /api/holdings
const getHoldings = async (req, res) => {
  try {
    const holdings = await prisma.holding.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ holdings });
  } catch (error) {
    console.error('Get holdings error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// POST /api/holdings
const addHolding = async (req, res) => {
  try {
    const { stockName, ticker, quantity, buyPrice, currentPrice, purchaseDate, market } = req.body;

    if (!stockName || !ticker || !quantity || !buyPrice) {
      return res.status(400).json({ error: 'stockName, ticker, quantity, and buyPrice are required.' });
    }

    const holding = await prisma.holding.create({
      data: {
        userId: req.user.id,
        stockName,
        ticker: ticker.toUpperCase(),
        quantity: parseInt(quantity),
        buyPrice: parseFloat(buyPrice),
        currentPrice: currentPrice ? parseFloat(currentPrice) : parseFloat(buyPrice),
        purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
        market: market || 'NASDAQ',
      },
    });

    res.status(201).json({ message: 'Holding added.', holding });
  } catch (error) {
    console.error('Add holding error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// PUT /api/holdings/:id
const updateHolding = async (req, res) => {
  try {
    const { id } = req.params;
    const { stockName, ticker, quantity, buyPrice, currentPrice, purchaseDate, market } = req.body;

    const existing = await prisma.holding.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Holding not found.' });
    }

    const holding = await prisma.holding.update({
      where: { id },
      data: {
        ...(stockName && { stockName }),
        ...(ticker && { ticker: ticker.toUpperCase() }),
        ...(quantity && { quantity: parseInt(quantity) }),
        ...(buyPrice && { buyPrice: parseFloat(buyPrice) }),
        ...(currentPrice && { currentPrice: parseFloat(currentPrice) }),
        ...(purchaseDate && { purchaseDate: new Date(purchaseDate) }),
        ...(market && { market }),
      },
    });

    res.json({ message: 'Holding updated.', holding });
  } catch (error) {
    console.error('Update holding error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// DELETE /api/holdings/:id
const deleteHolding = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.holding.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Holding not found.' });
    }

    await prisma.holding.delete({ where: { id } });

    res.json({ message: 'Holding deleted.' });
  } catch (error) {
    console.error('Delete holding error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// GET /api/holdings/summary
const getPortfolioSummary = async (req, res) => {
  try {
    const holdings = await prisma.holding.findMany({
      where: { userId: req.user.id },
    });

    const totalValue = holdings.reduce((sum, h) => sum + h.currentPrice * h.quantity, 0);
    const totalCost = holdings.reduce((sum, h) => sum + h.buyPrice * h.quantity, 0);
    const totalPnL = totalValue - totalCost;
    const pnlPercentage = totalCost > 0 ? ((totalPnL / totalCost) * 100) : 0;

    // Simulated daily change (in production, this would come from market data)
    const dailyChange = totalValue * 0.018;
    const dailyChangePercent = 1.8;

    res.json({
      summary: {
        totalValue: Math.round(totalValue * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
        totalPnL: Math.round(totalPnL * 100) / 100,
        pnlPercentage: Math.round(pnlPercentage * 100) / 100,
        dailyChange: Math.round(dailyChange * 100) / 100,
        dailyChangePercent,
        holdingsCount: holdings.length,
      },
    });
  } catch (error) {
    console.error('Portfolio summary error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// GET /api/holdings/pnl
const getPnL = async (req, res) => {
  try {
    const holdings = await prisma.holding.findMany({
      where: { userId: req.user.id },
    });

    const pnlData = holdings.map((h) => {
      const investedValue = h.buyPrice * h.quantity;
      const currentValue = h.currentPrice * h.quantity;
      const pnl = currentValue - investedValue;
      const pnlPercent = investedValue > 0 ? ((pnl / investedValue) * 100) : 0;

      return {
        id: h.id,
        stockName: h.stockName,
        ticker: h.ticker,
        quantity: h.quantity,
        buyPrice: h.buyPrice,
        currentPrice: h.currentPrice,
        investedValue: Math.round(investedValue * 100) / 100,
        currentValue: Math.round(currentValue * 100) / 100,
        pnl: Math.round(pnl * 100) / 100,
        pnlPercent: Math.round(pnlPercent * 100) / 100,
      };
    });

    const totalPnL = pnlData.reduce((sum, item) => sum + item.pnl, 0);
    const totalInvested = pnlData.reduce((sum, item) => sum + item.investedValue, 0);

    res.json({
      pnlData,
      totalPnL: Math.round(totalPnL * 100) / 100,
      totalInvested: Math.round(totalInvested * 100) / 100,
      totalPnLPercent: totalInvested > 0
        ? Math.round(((totalPnL / totalInvested) * 100) * 100) / 100
        : 0,
    });
  } catch (error) {
    console.error('P&L error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { getHoldings, addHolding, updateHolding, deleteHolding, getPortfolioSummary, getPnL };
