const fs = require('fs');
const path = require('path');

const MONTH_IDS = ['feb', 'mar', 'apr', 'may', 'jun', 'jul'];
const DATA_FILE = path.join(__dirname, '..', 'data.json');

function emptyMonthsObject() {
  return Object.fromEntries(MONTH_IDS.map((m) => [m, {}]));
}

function getDefaultData() {
  return {
    sixMonthGoals: ['', '', '', '', ''],
    sixMonthChecks: { '0': false, '1': false, '2': false, '3': false, '4': false },
    monthlyChecks: emptyMonthsObject(),
    dateChecks: emptyMonthsObject(),
  };
}

function ensureMonthKeys(obj) {
  for (const monthId of MONTH_IDS) {
    if (!(monthId in obj)) obj[monthId] = {};
  }
  return obj;
}

function load() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(raw);
    data.sixMonthGoals = Array.isArray(data.sixMonthGoals) ? data.sixMonthGoals : getDefaultData().sixMonthGoals;
    while (data.sixMonthGoals.length < 5) data.sixMonthGoals.push('');
    data.sixMonthGoals = data.sixMonthGoals.slice(0, 5);
    data.sixMonthChecks = data.sixMonthChecks && typeof data.sixMonthChecks === 'object' ? data.sixMonthChecks : getDefaultData().sixMonthChecks;
    data.monthlyChecks = ensureMonthKeys(data.monthlyChecks || {});
    data.dateChecks = ensureMonthKeys(data.dateChecks || {});
    return data;
  } catch (e) {
    if (e.code === 'ENOENT') return getDefaultData();
    throw e;
  }
}

function save(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

let state = load();

function getData() {
  return { ...state };
}

function setGoalText(index, text) {
  if (index < 0 || index > 4) throw new Error('Goal index must be 0-4');
  state.sixMonthGoals[index] = String(text ?? '');
  save(state);
  return state.sixMonthGoals[index];
}

function setGoalCheck(index, checked) {
  if (index < 0 || index > 4) throw new Error('Goal index must be 0-4');
  const key = String(index);
  if (checked === undefined) {
    state.sixMonthChecks[key] = !state.sixMonthChecks[key];
  } else {
    state.sixMonthChecks[key] = Boolean(checked);
  }
  save(state);
  return state.sixMonthChecks[key];
}

function setMonthlyCheck(monthId, itemIndex, checked) {
  if (!MONTH_IDS.includes(monthId)) throw new Error('Invalid monthId');
  const idx = Number(itemIndex);
  if (Number.isNaN(idx) || idx < 0 || idx > 5) throw new Error('Item index must be 0-5');
  const key = String(idx);
  if (checked === undefined) {
    state.monthlyChecks[monthId][key] = !state.monthlyChecks[monthId][key];
  } else {
    state.monthlyChecks[monthId][key] = Boolean(checked);
  }
  save(state);
  return state.monthlyChecks[monthId][key];
}

function setDailyCheck(monthId, day, checked) {
  if (!MONTH_IDS.includes(monthId)) throw new Error('Invalid monthId');
  const d = Number(day);
  if (Number.isNaN(d) || d < 1 || d > 31) throw new Error('Day must be 1-31');
  const key = String(d);
  if (checked === undefined) {
    state.dateChecks[monthId][key] = !state.dateChecks[monthId][key];
  } else {
    state.dateChecks[monthId][key] = Boolean(checked);
  }
  save(state);
  return state.dateChecks[monthId][key];
}

module.exports = {
  MONTH_IDS,
  getData,
  setGoalText,
  setGoalCheck,
  setMonthlyCheck,
  setDailyCheck,
};
