function getDateRanges(now) {
  const lastMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() - 1, 1)); // First day of last month
  const lastMonthEnd = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 0)); // Last day of last month

  const last12MonthsStart = new Date(Date.UTC(now.getFullYear() - 1, now.getMonth() - 1, 1)); // First day of last 12 months
  const yearToDateStart = new Date(Date.UTC(now.getFullYear(), 0, 1)); // Start of the year
  const last3MonthsStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() - 3, 1)); // Start of last 3 months
  const currentMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1)); // Start of the current month

  return {
    lastMonthStart,
    lastMonthEnd,
    last12MonthsStart,
    yearToDateStart,
    last3MonthsStart,
    currentMonthStart,
  };
}

module.exports = { getDateRanges };
