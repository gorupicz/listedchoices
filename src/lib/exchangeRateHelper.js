function getExchangeRate(platform, date, exchangeRates) {
  let targetDate;

  switch (platform) {
    case 'Airbnb':
      targetDate = new Date(date);
      targetDate.setDate(targetDate.getDate() + 1); // The day after check-in date
      break;
    case 'Booking':
      targetDate = new Date(date);
      targetDate.setMonth(targetDate.getMonth() + 1); // Move to the next month
      targetDate.setDate(3); // Set to the third day of the next month
      break;
    case 'Direct':
    case 'Vrbo':
      targetDate = new Date(date); // Check-in day
      break;
    default:
      targetDate = new Date(date); // Fallback in case no platform matches
      break;
  }

  // Ensure the exchange rates are sorted by date (if not already sorted)
  exchangeRates.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Find the most recent exchange rate on or before the targetDate
  let applicableRate = null;
  for (let i = exchangeRates.length - 1; i >= 0; i--) {
    if (new Date(exchangeRates[i].date) <= targetDate) {
      applicableRate = exchangeRates[i].value;
      break;
    }
  }
  if (applicableRate == null){
    console.log("Applicable Exchange Rate is null");
  }
  // Default to 1 if no applicable rate is found (which shouldn't happen if rates are present)
  const exchangeRate = applicableRate || 18;

  return exchangeRate;
}

module.exports = { getExchangeRate };
