const express = require('express');
const store = require('./store');

const router = express.Router();
const { MONTH_IDS } = store;

// GET /api/data
router.get('/data', (req, res) => {
  res.json(store.getData());
});

// PATCH /api/goals/:index — update goal text
router.patch('/goals/:index', (req, res, next) => {
  try {
    const index = parseInt(req.params.index, 10);
    if (Number.isNaN(index) || index < 0 || index > 4) {
      return res.status(400).json({ error: 'Index must be 0-4' });
    }
    const { text } = req.body;
    if (text !== undefined && typeof text !== 'string') {
      return res.status(400).json({ error: 'Body must include text (string)' });
    }
    store.setGoalText(index, text);
    res.json(store.getData());
  } catch (err) {
    next(err);
  }
});

// PATCH /api/goals/:index/check — toggle six-month checkbox
router.patch('/goals/:index/check', (req, res, next) => {
  try {
    const index = parseInt(req.params.index, 10);
    if (Number.isNaN(index) || index < 0 || index > 4) {
      return res.status(400).json({ error: 'Index must be 0-4' });
    }
    const { checked } = req.body;
    if (checked !== undefined && typeof checked !== 'boolean') {
      return res.status(400).json({ error: 'Body may include checked (boolean)' });
    }
    const value = store.setGoalCheck(index, checked);
    res.json(store.getData());
  } catch (err) {
    next(err);
  }
});

// PATCH /api/monthly/:monthId/:itemIndex
router.patch('/monthly/:monthId/:itemIndex', (req, res, next) => {
  try {
    const { monthId, itemIndex } = req.params;
    if (!MONTH_IDS.includes(monthId)) {
      return res.status(400).json({ error: 'Invalid monthId. Use: feb, mar, apr, may, jun, jul' });
    }
    const index = parseInt(itemIndex, 10);
    if (Number.isNaN(index) || index < 0 || index > 5) {
      return res.status(400).json({ error: 'Item index must be 0-5' });
    }
    const { checked } = req.body;
    if (checked !== undefined && typeof checked !== 'boolean') {
      return res.status(400).json({ error: 'Body may include checked (boolean)' });
    }
    store.setMonthlyCheck(monthId, index, checked);
    res.json(store.getData());
  } catch (err) {
    next(err);
  }
});

// PATCH /api/daily/:monthId/:day
router.patch('/daily/:monthId/:day', (req, res, next) => {
  try {
    const { monthId, day } = req.params;
    if (!MONTH_IDS.includes(monthId)) {
      return res.status(400).json({ error: 'Invalid monthId. Use: feb, mar, apr, may, jun, jul' });
    }
    const d = parseInt(day, 10);
    if (Number.isNaN(d) || d < 1 || d > 31) {
      return res.status(400).json({ error: 'Day must be 1-31' });
    }
    const { checked } = req.body;
    if (checked !== undefined && typeof checked !== 'boolean') {
      return res.status(400).json({ error: 'Body may include checked (boolean)' });
    }
    store.setDailyCheck(monthId, d, checked);
    res.json(store.getData());
  } catch (err) {
    next(err);
  }
});

module.exports = router;
