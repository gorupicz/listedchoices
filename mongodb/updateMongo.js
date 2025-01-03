const connectMongoDB = require('./mongoClient');
const prisma = require('../src/lib/prisma');
const { getDateRanges } = require('../src/lib/dateRangeHelper'); 
const { calculateNightsWithinPeriod } = require('../src/lib/NightsWithinPeriodHelper'); 
const { getExchangeRate } = require('../src/lib/exchangeRateHelper'); 

// Helper function to compare only the year, month, and day of two dates
function isSameOrWithinMonth(startDate, periodStart, periodEnd) {
  const start = {
    year: startDate.getUTCFullYear(),
    month: startDate.getUTCMonth(),
    day: startDate.getUTCDate(),
  };
  const periodStartDate = {
    year: periodStart.getUTCFullYear(),
    month: periodStart.getUTCMonth(),
    day: periodStart.getUTCDate(),
  };
  const periodEndDate = {
    year: periodEnd.getUTCFullFullYear(),
    month: periodEnd.getUTCMonth(),
    day: periodEnd.getUTCDate(),
  };

  return (
    (start.year > periodStartDate.year ||
      (start.year === periodStartDate.year && start.month > periodStartDate.month) ||
      (start.year === periodStartDate.year &&
        start.month === periodStartDate.month &&
        start.day >= periodStartDate.day)) &&
    (start.year < periodEndDate.year ||
      (start.year === periodEndDate.year && start.month < periodEndDate.month) ||
      (start.year === periodEndDate.year &&
        start.month === periodEndDate.month &&
        start.day <= periodEndDate.day))
  );
}

async function updatePropertyIncome(propertyId) {
  try {
    // Fetch reservations for the given property ID using Prisma
    const reservations = await prisma.reservation.findMany({
      where: {
        listing: {
          property_id: propertyId
        }
      },
      select: {
        id: true,
        base_price: true,
        currency: true,
        start_date: true,
        end_date: true,
        reservation_id: true,
        platform_commission: true,
        listing: {
          select: {
            platform_account: {
              select: {
                platform: true
              }
            }
          }
        }
      }
    });

    // Fetch exchange rates for required calculations
    const exchangeRates = await prisma.exchangeRate.findMany();

    // Hardcode the current date
    const now = new Date('2025-01-03');

    // Date ranges:
    const {
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
      currentMonthStartPreviousYear
    } = getDateRanges(now);

    // Log date ranges for debugging
    console.log(`Last month: ${lastMonthStart} to ${lastMonthEnd}`);
    console.log(`Last 12 months: ${last12MonthsStart} to ${lastMonthEnd}`);
    console.log(`Year to date: ${yearToDateStart} to ${lastMonthEnd}`);
    console.log(`Last 3 months: ${last3MonthsStart} to ${lastMonthEnd}`);
    console.log(`Current month: ${currentMonthStart} to ${now}`);

    // Initialize income storage for different time periods
    const incomeUSD = {
      total: 0,
      lastMonth: 0,
      last12Months: 0,
      yearToDate: 0,
      last3Months: 0,
      currentMonth: 0,
      lastMonthPreviousYear: 0,
      last12MonthsPreviousYear: 0,
      yearToDatePreviousYear: 0,
      last3MonthsPreviousYear: 0,
      currentMonthPreviousYear: 0
    };

    const incomeMXN = {
      total: 0,
      lastMonth: 0,
      last12Months: 0,
      yearToDate: 0,
      last3Months: 0,
      currentMonth: 0,
      lastMonthPreviousYear: 0,
      last12MonthsPreviousYear: 0,
      yearToDatePreviousYear: 0,
      last3MonthsPreviousYear: 0,
      currentMonthPreviousYear: 0
    };

    // Initialize occupancy storage
    const occupancy = {
      totalNights: 0, // Correct: totalNights is now a global counter across all reservations
      lastMonthNights: 0,
      last12MonthsNights: 0,
      yearToDateNights: 0,
      last3MonthsNights: 0,
      currentMonthNights: 0,
      lastMonthPreviousYearNights: 0,
      last12MonthsPreviousYearNights: 0,
      yearToDatePreviousYearNights: 0,
      last3MonthsPreviousYearNights: 0,
      currentMonthPreviousYearNights: 0
    };

    // Process each reservation and calculate income for each period
    reservations.forEach((reservation) => {
      const startDate = new Date(reservation.start_date);
      const endDate = new Date(reservation.end_date);

      const platform = reservation.listing.platform_account.platform;
      const exchangeRate = getExchangeRate(platform, reservation.start_date, exchangeRates);

      let amountInUSD, amountInMXN;

      // Calculate total income in USD
      if (reservation.currency === 'USD') {
        amountInUSD = reservation.base_price; // No conversion needed
      } else if (reservation.currency === 'MXN') {
        amountInUSD = reservation.base_price / exchangeRate; // Convert MXN to USD
      }
      incomeUSD.total += Number(amountInUSD);

      // Calculate total income in MXN
      if (reservation.currency === 'MXN') {
        amountInMXN = reservation.base_price; // No conversion needed
      } else if (reservation.currency === 'USD') {
        amountInMXN = reservation.base_price * exchangeRate; // Convert USD to MXN
      }
      incomeMXN.total += Number(amountInMXN);

      // Add to respective time periods and calculate occupancy correctly

      // Last month
      const lastMonthNights = calculateNightsWithinPeriod(startDate, endDate, lastMonthStart, lastMonthEnd);
      if (lastMonthNights > 0) {
        incomeUSD.lastMonth += Number(amountInUSD);
        incomeMXN.lastMonth += Number(amountInMXN);
        occupancy.lastMonthNights += lastMonthNights;
      }
      //Last month (Previous Year)
      const lastMonthNightsPreviousYear = calculateNightsWithinPeriod(startDate, endDate, lastMonthStartPreviousYear, lastMonthEndPreviousYear);
      if (lastMonthNightsPreviousYear > 0) {
        incomeUSD.lastMonthPreviousYear += Number(amountInUSD);
        incomeMXN.lastMonthPreviousYear += Number(amountInMXN);
        occupancy.lastMonthPreviousYearNights += lastMonthNightsPreviousYear;
      }

      // Last 12 months
      const last12MonthsNights = calculateNightsWithinPeriod(startDate, endDate, last12MonthsStart, lastMonthEnd);
      if (last12MonthsNights > 0) {
        incomeUSD.last12Months += Number(amountInUSD);
        incomeMXN.last12Months += Number(amountInMXN);
        occupancy.last12MonthsNights += last12MonthsNights;
      }
      //Last 12 months (Previous Year)
      const last12MonthsNightsPreviousYear = calculateNightsWithinPeriod(startDate, endDate, last12MonthsStartPreviousYear, lastMonthEndPreviousYear);
      if (last12MonthsNightsPreviousYear > 0) {
        incomeUSD.last12MonthsPreviousYear += Number(amountInUSD);
        incomeMXN.last12MonthsPreviousYear += Number(amountInMXN);
        occupancy.last12MonthsPreviousYearNights += last12MonthsNightsPreviousYear;
      }

      // Year to date
      const yearToDateNights = calculateNightsWithinPeriod(startDate, endDate, yearToDateStart, lastMonthEnd);
      if (yearToDateNights > 0) {
        incomeUSD.yearToDate += Number(amountInUSD);
        incomeMXN.yearToDate += Number(amountInMXN);
        occupancy.yearToDateNights += yearToDateNights;
      }

      // Last 3 months
      const last3MonthsNights = calculateNightsWithinPeriod(startDate, endDate, last3MonthsStart, lastMonthEnd);
      if (last3MonthsNights > 0) {
        incomeUSD.last3Months += Number(amountInUSD);
        incomeMXN.last3Months += Number(amountInMXN);
        occupancy.last3MonthsNights += last3MonthsNights;
      }
      //Last 3 months (Previous Year)
      const last3MonthsNightsPreviousYear = calculateNightsWithinPeriod(startDate, endDate, last3MonthsStartPreviousYear, lastMonthEndPreviousYear);
      if (last3MonthsNightsPreviousYear > 0) {
        incomeUSD.last3MonthsPreviousYear += Number(amountInUSD);
        incomeMXN.last3MonthsPreviousYear += Number(amountInMXN);
        occupancy.last3MonthsPreviousYearNights += last3MonthsNightsPreviousYear;
      }

      // Current month
      const currentMonthNights = calculateNightsWithinPeriod(startDate, endDate, currentMonthStart, now);
      if (currentMonthNights > 0) {
        incomeUSD.currentMonth += Number(amountInUSD);
        incomeMXN.currentMonth += Number(amountInMXN);
        occupancy.currentMonthNights += currentMonthNights;
      }

      // Correctly calculate total nights across all reservations, without period limitations
      occupancy.totalNights += calculateNightsWithinPeriod(startDate, endDate, startDate, endDate);
    });

    // Prepare data to be updated in MongoDB
    const incomeData = {
      totalUSD: incomeUSD.total,
      lastMonthUSD: incomeUSD.lastMonth,
      last12MonthsUSD: incomeUSD.last12Months,
      yearToDateUSD: incomeUSD.yearToDate,
      last3MonthsUSD: incomeUSD.last3Months,
      currentMonthUSD: incomeUSD.currentMonth,
      lastMonthPreviousYearUSD: incomeUSD.lastMonthPreviousYear,
      last12MonthsPreviousYearUSD: incomeUSD.last12MonthsPreviousYear,
      last3MonthsPreviousYearUSD: incomeUSD.last3MonthsPreviousYear,
      totalMXN: incomeMXN.total,
      lastMonthMXN: incomeMXN.lastMonth,
      last12MonthsMXN: incomeMXN.last12Months,
      yearToDateMXN: incomeMXN.yearToDate,
      last3MonthsMXN: incomeMXN.last3Months,
      currentMonthMXN: incomeMXN.currentMonth,
      lastMonthPreviousYearMXN: incomeMXN.lastMonthPreviousYear,
      last12MonthsPreviousYearMXN: incomeMXN.last12MonthsPreviousYear,
      last3MonthsPreviousYearMXN: incomeMXN.last3MonthsPreviousYear,
    };

    const occupancyData = {
      totalNights: occupancy.totalNights, // Fixed to count nights for all reservations
      lastMonthNights: occupancy.lastMonthNights,
      last12MonthsNights: occupancy.last12MonthsNights,
      yearToDateNights: occupancy.yearToDateNights,
      last3MonthsNights: occupancy.last3MonthsNights,
      currentMonthNights: occupancy.currentMonthNights,
      lastMonthPreviousYearNights: occupancy.lastMonthPreviousYearNights,
      last12MonthsPreviousYearNights: occupancy.last12MonthsPreviousYearNights,
      last3MonthsPreviousYearNights: occupancy.last3MonthsPreviousYearNights,
    };

    // Connect to MongoDB and update the income and occupancy for the given property
    const db = await connectMongoDB();
    const listingsCollection = db.collection('listings');

    const result = await listingsCollection.updateOne(
      { 'property_id': propertyId }, // Match the property ID in MongoDB
      {
        $set: {
          'income': incomeData,
          'occupancy': occupancyData, // Update the occupancy field
          'updated_at': now
        }
      }
    );

    console.log(`Updated property income and occupancy: ${result.modifiedCount} document(s) modified`);
  } catch (error) {
    console.error('Error updating property income:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script for property ID
updatePropertyIncome(4);