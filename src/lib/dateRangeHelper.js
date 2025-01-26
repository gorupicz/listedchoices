const { startOfMonth, endOfMonth, startOfYear, subMonths } = require('date-fns');

function getDateRanges(now) {
  const lastMonthStart = startOfMonth(subMonths(now, 1)); // First day of last month
  const lastMonthStartPreviousYear = startOfMonth(subMonths(now, 13)); // First day of last month
  const lastMonthEnd = endOfMonth(subMonths(now, 1));
  const lastMonthEndPreviousYear = endOfMonth(subMonths(now, 13));

  const last12MonthsStart = startOfMonth(subMonths(lastMonthStart, 11)); // First day of the month 12 months ago  
  const last12MonthsStartPreviousYear = startOfMonth(subMonths(lastMonthStartPreviousYear, 11)); // First day of the month 12 months ago
  const yearToDateStart  = startOfYear(lastMonthStart); // Start of the year
  const yearToDateStartPreviousYear = startOfYear(lastMonthStartPreviousYear); // Start of the year
  const last3MonthsStart = startOfMonth(subMonths(lastMonthStart, 2)); // Start of last 3 months
  const last3MonthsStartPreviousYear = startOfMonth(subMonths(lastMonthStartPreviousYear, 2)); // Start of last 3 months
  const currentMonthStart = startOfMonth(now); // Start of the current month
  const currentMonthStartPreviousYear = startOfMonth(lastMonthStartPreviousYear); // Start of the current month

  return {
    lastMonthStart,
    lastMonthEnd,
    last12MonthsStart,
    yearToDateStart,
    last3MonthsStart,
    currentMonthStart,
    lastMonthStartPreviousYear,
    lastMonthEndPreviousYear,
    last12MonthsStartPreviousYear,
    yearToDateStartPreviousYear,
    last3MonthsStartPreviousYear,
    currentMonthStartPreviousYear,
  };
}

module.exports = { getDateRanges };