// Helper function to calculate the number of nights between two dates that fall within a specific period
function calculateNightsWithinPeriod(startDate, endDate, periodStart, periodEnd) {
  const start = new Date(startDate > periodStart ? startDate : periodStart); // Take the later date
  const end = new Date(endDate < periodEnd ? endDate : periodEnd); // Take the earlier date

  // If the start date is after the end date, return 0 (the reservation doesn't overlap the period)
  if (start > end) {
    return 0;
  }

  const timeDifference = end.getTime() - start.getTime();
  const daysDifference = timeDifference / (1000 * 3600 * 24); // Convert to days
  return Math.round(daysDifference);
}

module.exports = { calculateNightsWithinPeriod };