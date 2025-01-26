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
      orderBy: {
        end_date: 'asc'
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
            property_id: true,
            platform_account: {
              select: {
                platform: true
              }
            }
          }
        }
      }
    });

    // Build the checkOuts array
    const endDateMap = new Map();

    reservations.forEach(reservation => {
      const endDate = reservation.end_date.toISOString().split('T')[0]; // Convert to date string
      if (endDateMap.has(endDate)) {
        endDateMap.set(endDate, endDateMap.get(endDate) + 1);
      } else {
        endDateMap.set(endDate, 1);
      }
    });

    const checkOuts = Array.from(endDateMap, ([endDate, count]) => ({ endDate, count }));

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

    const expensesCOGSPlatformFeesUSD = {
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

    const expensesCOGSConsumablesUSD = {
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

    const expensesCOGSCleaningUSD = {
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

    const expensesCOGSPlatformFeesMXN = {
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

    const expensesCOGSConsumablesMXN = {
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

    const expensesCOGSCleaningMXN = {
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
    let previousCheckoutDate = null;

    // Process each reservation and calculate income for each period
    reservations.forEach((reservation) => {
      if(reservation.listing.property_id == propertyId) {
        const startDate = new Date(reservation.start_date);
        const endDate = new Date(reservation.end_date);
        const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)); // Calculate total nights
        const platform = reservation.listing.platform_account.platform;
        const exchangeRate = getExchangeRate(platform, reservation.start_date, exchangeRates);

        let amountInUSD, amountInMXN, amountInCOGSPlatformFeesUSD, amountInCOGSPlatformFeesMXN, amountInCOGSConsumablesUSD, amountInCOGSConsumablesMXN, amountInCOGSCleaningUSD, amountInCOGSCleaningMXN;

        amountInCOGSConsumablesUSD = nights * 1;
        amountInCOGSConsumablesMXN = amountInCOGSConsumablesUSD * exchangeRate;
        
        if (previousCheckoutDate != reservation.end_date.toISOString().split('T')[0]) {
          amountInCOGSCleaningMXN = 300;
        } else {
          amountInCOGSCleaningMXN = 200;
        }
        amountInCOGSCleaningUSD = amountInCOGSCleaningMXN / exchangeRate;
        
        // Calculate total income in USD
        if (reservation.currency === 'USD') {
          amountInUSD = reservation.base_price; // No conversion needed
          amountInCOGSPlatformFeesUSD = reservation.platform_commission;
        } else if (reservation.currency === 'MXN') {
          amountInUSD = reservation.base_price / exchangeRate; // Convert MXN to USD
          amountInCOGSPlatformFeesUSD = reservation.platform_commission / exchangeRate;
        }
        incomeUSD.total += Number(amountInUSD);
        expensesCOGSPlatformFeesUSD.total += Number(amountInCOGSPlatformFeesUSD);
        expensesCOGSConsumablesUSD.total += Number(amountInCOGSConsumablesUSD);
        expensesCOGSCleaningUSD.total += Number(amountInCOGSCleaningUSD);
        // Calculate total income in MXN
        if (reservation.currency === 'MXN') {
          amountInMXN = reservation.base_price; // No conversion needed
          amountInCOGSPlatformFeesMXN = reservation.platform_commission;
        } else if (reservation.currency === 'USD') {
          amountInMXN = reservation.base_price * exchangeRate; // Convert USD to MXN
          amountInCOGSPlatformFeesMXN = reservation.platform_commission * exchangeRate;
        }
        incomeMXN.total += Number(amountInMXN);
        expensesCOGSPlatformFeesMXN.total += Number(amountInCOGSPlatformFeesMXN);
        expensesCOGSConsumablesMXN.total += Number(amountInCOGSConsumablesMXN);
        expensesCOGSCleaningMXN.total += Number(amountInCOGSCleaningMXN);
        
        // Add to respective time periods and calculate occupancy correctly

        // Last month
        const lastMonthNights = calculateNightsWithinPeriod(startDate, endDate, lastMonthStart, lastMonthEnd);
        if (lastMonthNights > 0) {
          incomeUSD.lastMonth += Number(amountInUSD);
          incomeMXN.lastMonth += Number(amountInMXN);
          expensesCOGSPlatformFeesUSD.lastMonth += Number(amountInCOGSPlatformFeesUSD);
          expensesCOGSPlatformFeesMXN.lastMonth += Number(amountInCOGSPlatformFeesMXN);
          expensesCOGSConsumablesUSD.lastMonth += Number(amountInCOGSConsumablesUSD);
          expensesCOGSConsumablesMXN.lastMonth += Number(amountInCOGSConsumablesMXN);
          expensesCOGSCleaningUSD.lastMonth += Number(amountInCOGSCleaningUSD);
          expensesCOGSCleaningMXN.lastMonth += Number(amountInCOGSCleaningMXN);
          occupancy.lastMonthNights += lastMonthNights;
        }
        //Last month (Previous Year)
        const lastMonthNightsPreviousYear = calculateNightsWithinPeriod(startDate, endDate, lastMonthStartPreviousYear, lastMonthEndPreviousYear);
        if (lastMonthNightsPreviousYear > 0) {
          incomeUSD.lastMonthPreviousYear += Number(amountInUSD);
          incomeMXN.lastMonthPreviousYear += Number(amountInMXN);
          expensesCOGSPlatformFeesUSD.lastMonthPreviousYear += Number(amountInCOGSPlatformFeesUSD);
          expensesCOGSPlatformFeesMXN.lastMonthPreviousYear += Number(amountInCOGSPlatformFeesMXN);
          expensesCOGSConsumablesUSD.lastMonthPreviousYear += Number(amountInCOGSConsumablesUSD);
          expensesCOGSConsumablesMXN.lastMonthPreviousYear += Number(amountInCOGSConsumablesMXN);
          expensesCOGSCleaningUSD.lastMonthPreviousYear += Number(amountInCOGSCleaningUSD);
          expensesCOGSCleaningMXN.lastMonthPreviousYear += Number(amountInCOGSCleaningMXN);
          occupancy.lastMonthPreviousYearNights += lastMonthNightsPreviousYear;
        }

        // Last 12 months
        const last12MonthsNights = calculateNightsWithinPeriod(startDate, endDate, last12MonthsStart, lastMonthEnd);
        if (last12MonthsNights > 0) {
          incomeUSD.last12Months += Number(amountInUSD);
          incomeMXN.last12Months += Number(amountInMXN);
          expensesCOGSPlatformFeesUSD.last12Months += Number(amountInCOGSPlatformFeesUSD);
          expensesCOGSPlatformFeesMXN.last12Months += Number(amountInCOGSPlatformFeesMXN);
          expensesCOGSConsumablesUSD.last12Months += Number(amountInCOGSConsumablesUSD);
          expensesCOGSConsumablesMXN.last12Months += Number(amountInCOGSConsumablesMXN);
          expensesCOGSCleaningUSD.last12Months += Number(amountInCOGSCleaningUSD);
          expensesCOGSCleaningMXN.last12Months += Number(amountInCOGSCleaningMXN);
          occupancy.last12MonthsNights += last12MonthsNights;
        }
        //Last 12 months (Previous Year)
        const last12MonthsNightsPreviousYear = calculateNightsWithinPeriod(startDate, endDate, last12MonthsStartPreviousYear, lastMonthEndPreviousYear);
        if (last12MonthsNightsPreviousYear > 0) {
          incomeUSD.last12MonthsPreviousYear += Number(amountInUSD);
          incomeMXN.last12MonthsPreviousYear += Number(amountInMXN);
          expensesCOGSPlatformFeesUSD.last12MonthsPreviousYear += Number(amountInCOGSPlatformFeesUSD);
          expensesCOGSPlatformFeesMXN.last12MonthsPreviousYear += Number(amountInCOGSPlatformFeesMXN);
          expensesCOGSConsumablesUSD.last12MonthsPreviousYear += Number(amountInCOGSConsumablesUSD);
          expensesCOGSConsumablesMXN.last12MonthsPreviousYear += Number(amountInCOGSConsumablesMXN);
          expensesCOGSCleaningUSD.last12MonthsPreviousYear += Number(amountInCOGSCleaningUSD);
          expensesCOGSCleaningMXN.last12MonthsPreviousYear += Number(amountInCOGSCleaningMXN);
          occupancy.last12MonthsPreviousYearNights += last12MonthsNightsPreviousYear;
        }

        // Year to date
        const yearToDateNights = calculateNightsWithinPeriod(startDate, endDate, yearToDateStart, lastMonthEnd);
        if (yearToDateNights > 0) {
          incomeUSD.yearToDate += Number(amountInUSD);
          incomeMXN.yearToDate += Number(amountInMXN);
          expensesCOGSPlatformFeesUSD.yearToDate += Number(amountInCOGSPlatformFeesUSD);
          expensesCOGSPlatformFeesMXN.yearToDate += Number(amountInCOGSPlatformFeesMXN);
          expensesCOGSConsumablesUSD.yearToDate += Number(amountInCOGSConsumablesUSD);
          expensesCOGSConsumablesMXN.yearToDate += Number(amountInCOGSConsumablesMXN);
          expensesCOGSCleaningUSD.yearToDate += Number(amountInCOGSCleaningUSD);
          expensesCOGSCleaningMXN.yearToDate += Number(amountInCOGSCleaningMXN);
          occupancy.yearToDateNights += yearToDateNights;
        }

        const yearToDateNightsPreviousYear = calculateNightsWithinPeriod(startDate, endDate, yearToDateStartPreviousYear, lastMonthEndPreviousYear);
        if (yearToDateNightsPreviousYear > 0) {
          incomeUSD.yearToDatePreviousYear += Number(amountInUSD);
          incomeMXN.yearToDatePreviousYear += Number(amountInMXN);
          occupancy.yearToDatePreviousYearNights += yearToDateNightsPreviousYear;
        }

        // Last 3 months
        const last3MonthsNights = calculateNightsWithinPeriod(startDate, endDate, last3MonthsStart, lastMonthEnd);
        if (last3MonthsNights > 0) {
          incomeUSD.last3Months += Number(amountInUSD);
          incomeMXN.last3Months += Number(amountInMXN);
          expensesCOGSPlatformFeesUSD.last3Months += Number(amountInCOGSPlatformFeesUSD);
          expensesCOGSPlatformFeesMXN.last3Months += Number(amountInCOGSPlatformFeesMXN);
          expensesCOGSConsumablesUSD.last3Months += Number(amountInCOGSConsumablesUSD);
          expensesCOGSConsumablesMXN.last3Months += Number(amountInCOGSConsumablesMXN);
          expensesCOGSCleaningUSD.last3Months += Number(amountInCOGSCleaningUSD);
          expensesCOGSCleaningMXN.last3Months += Number(amountInCOGSCleaningMXN);
          occupancy.last3MonthsNights += last3MonthsNights;
        }
        //Last 3 months (Previous Year)
        const last3MonthsNightsPreviousYear = calculateNightsWithinPeriod(startDate, endDate, last3MonthsStartPreviousYear, lastMonthEndPreviousYear);
        if (last3MonthsNightsPreviousYear > 0) {
          incomeUSD.last3MonthsPreviousYear += Number(amountInUSD);
          incomeMXN.last3MonthsPreviousYear += Number(amountInMXN);
          expensesCOGSPlatformFeesUSD.last3MonthsPreviousYear += Number(amountInCOGSPlatformFeesUSD);
          expensesCOGSPlatformFeesMXN.last3MonthsPreviousYear += Number(amountInCOGSPlatformFeesMXN);
          expensesCOGSConsumablesUSD.last3MonthsPreviousYear += Number(amountInCOGSConsumablesUSD);
          expensesCOGSConsumablesMXN.last3MonthsPreviousYear += Number(amountInCOGSConsumablesMXN);
          expensesCOGSCleaningUSD.last3MonthsPreviousYear += Number(amountInCOGSCleaningUSD);
          expensesCOGSCleaningMXN.last3MonthsPreviousYear += Number(amountInCOGSCleaningMXN);
          occupancy.last3MonthsPreviousYearNights += last3MonthsNightsPreviousYear;
        }

        // Current month
        const currentMonthNights = calculateNightsWithinPeriod(startDate, endDate, currentMonthStart, now);
        if (currentMonthNights > 0) {
          incomeUSD.currentMonth += Number(amountInUSD);
          incomeMXN.currentMonth += Number(amountInMXN);
          expensesCOGSPlatformFeesUSD.currentMonth += Number(amountInCOGSPlatformFeesUSD);
          expensesCOGSPlatformFeesMXN.currentMonth += Number(amountInCOGSPlatformFeesMXN);
          expensesCOGSConsumablesUSD.currentMonth += Number(amountInCOGSConsumablesUSD);
          expensesCOGSConsumablesMXN.currentMonth += Number(amountInCOGSConsumablesMXN);
          expensesCOGSCleaningUSD.currentMonth += Number(amountInCOGSCleaningUSD);
          expensesCOGSCleaningMXN.currentMonth += Number(amountInCOGSCleaningMXN);
          occupancy.currentMonthNights += currentMonthNights;
        }

        // Correctly calculate total nights across all reservations, without period limitations
        occupancy.totalNights += calculateNightsWithinPeriod(startDate, endDate, startDate, endDate);
      }
      previousCheckoutDate = reservation.end_date.toISOString().split('T')[0];
    });

    // Connect to MongoDB and fetch SG&A expenses for the given property
    const db = await connectMongoDB();
    const listingsCollection = db.collection('listings');
    const property = await listingsCollection.findOne({ 'property_id': propertyId });

    // Initialize SG&A expenses storage
    const expensesSGAData = {
      lastMonthUSD: 0,
      last12MonthsUSD: 0,
      last3MonthsUSD: 0,
      lastMonthPreviousYearUSD: 0,
      last12MonthsPreviousYearUSD: 0,
      last3MonthsPreviousYearUSD: 0,
      // Add other periods and currencies as needed
    };

    // Sum up all SG&A expenses
    if (property && property['sg&a']) {
      for (const expenseType in property['sg&a']) {
        const expense = property['sg&a'][expenseType];
        expensesSGAData.lastMonthUSD += expense.lastMonthUSD || 0;
        expensesSGAData.last12MonthsUSD += expense.last12MonthsUSD || 0;
        expensesSGAData.last3MonthsUSD += expense.last3MonthsUSD || 0;
        expensesSGAData.lastMonthPreviousYearUSD += expense.lastMonthPreviousYearUSD || 0;
        expensesSGAData.last12MonthsPreviousYearUSD += expense.last12MonthsPreviousYearUSD || 0;
        expensesSGAData.last3MonthsPreviousYearUSD += expense.last3MonthsPreviousYearUSD || 0;
        // Add other periods and currencies as needed
      }
    }

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

    const expensesCOGSPlatformFeesData = {
      totalUSD: expensesCOGSPlatformFeesUSD.total,
      lastMonthUSD: expensesCOGSPlatformFeesUSD.lastMonth,
      last12MonthsUSD: expensesCOGSPlatformFeesUSD.last12Months,
      yearToDateUSD: expensesCOGSPlatformFeesUSD.yearToDate,
      last3MonthsUSD: expensesCOGSPlatformFeesUSD.last3Months,
      currentMonthUSD: expensesCOGSPlatformFeesUSD.currentMonth,
      lastMonthPreviousYearUSD: expensesCOGSPlatformFeesUSD.lastMonthPreviousYear,
      last12MonthsPreviousYearUSD: expensesCOGSPlatformFeesUSD.last12MonthsPreviousYear,
      last3MonthsPreviousYearUSD: expensesCOGSPlatformFeesUSD.last3MonthsPreviousYear,
      totalMXN: expensesCOGSPlatformFeesMXN.total,
      lastMonthMXN: expensesCOGSPlatformFeesMXN.lastMonth,
      last12MonthsMXN: expensesCOGSPlatformFeesMXN.last12Months,
      yearToDateMXN: expensesCOGSPlatformFeesMXN.yearToDate,
      last3MonthsMXN: expensesCOGSPlatformFeesMXN.last3Months,
      currentMonthMXN: expensesCOGSPlatformFeesMXN.currentMonth,
      lastMonthPreviousYearMXN: expensesCOGSPlatformFeesMXN.lastMonthPreviousYear,
      last12MonthsPreviousYearMXN: expensesCOGSPlatformFeesMXN.last12MonthsPreviousYear,
      last3MonthsPreviousYearMXN: expensesCOGSPlatformFeesMXN.last3MonthsPreviousYear,
    };

    const expensesCOGSPropertyManagementFeesData = {
      totalUSD: incomeUSD.total*0.15,
      lastMonthUSD: incomeUSD.lastMonth*0.15,
      last12MonthsUSD: incomeUSD.last12Months*0.15,
      yearToDateUSD: incomeUSD.yearToDate*0.15,
      last3MonthsUSD: incomeUSD.last3Months*0.15,
      currentMonthUSD: incomeUSD.currentMonth*0.15,
      lastMonthPreviousYearUSD: incomeUSD.lastMonthPreviousYear*0.15,
      last12MonthsPreviousYearUSD: incomeUSD.last12MonthsPreviousYear*0.15,
      last3MonthsPreviousYearUSD: incomeUSD.last3MonthsPreviousYear*0.15, 
      totalMXN: incomeMXN.total*0.15,
      lastMonthMXN: incomeMXN.lastMonth*0.15,
      last12MonthsMXN: incomeMXN.last12Months*0.15,
      yearToDateMXN: incomeMXN.yearToDate*0.15,
      last3MonthsMXN: incomeMXN.last3Months*0.15,
      currentMonthMXN: incomeMXN.currentMonth*0.15,
      lastMonthPreviousYearMXN: incomeMXN.lastMonthPreviousYear*0.15,
      last12MonthsPreviousYearMXN: incomeMXN.last12MonthsPreviousYear*0.15,
      last3MonthsPreviousYearMXN: incomeMXN.last3MonthsPreviousYear*0.15,
    };

    const expensesCOGSConsumablesData = {
      totalUSD: expensesCOGSConsumablesUSD.total,
      lastMonthUSD: expensesCOGSConsumablesUSD.lastMonth,
      last12MonthsUSD: expensesCOGSConsumablesUSD.last12Months,
      yearToDateUSD: expensesCOGSConsumablesUSD.yearToDate,
      last3MonthsUSD: expensesCOGSConsumablesUSD.last3Months,
      currentMonthUSD: expensesCOGSConsumablesUSD.currentMonth,
      lastMonthPreviousYearUSD: expensesCOGSConsumablesUSD.lastMonthPreviousYear,
      last12MonthsPreviousYearUSD: expensesCOGSConsumablesUSD.last12MonthsPreviousYear,
      last3MonthsPreviousYearUSD: expensesCOGSConsumablesUSD.last3MonthsPreviousYear,
      totalMXN: expensesCOGSConsumablesMXN.total,
      lastMonthMXN: expensesCOGSConsumablesMXN.lastMonth,
      last12MonthsMXN: expensesCOGSConsumablesMXN.last12Months,
      yearToDateMXN: expensesCOGSConsumablesMXN.yearToDate,
      last3MonthsMXN: expensesCOGSConsumablesMXN.last3Months,
      currentMonthMXN: expensesCOGSConsumablesMXN.currentMonth,
      lastMonthPreviousYearMXN: expensesCOGSConsumablesMXN.lastMonthPreviousYear,
      last12MonthsPreviousYearMXN: expensesCOGSConsumablesMXN.last12MonthsPreviousYear,
      last3MonthsPreviousYearMXN: expensesCOGSConsumablesMXN.last3MonthsPreviousYear,
    };

    const expensesCOGSCleaningData = {
      totalUSD: expensesCOGSCleaningUSD.total,
      lastMonthUSD: expensesCOGSCleaningUSD.lastMonth,
      last12MonthsUSD: expensesCOGSCleaningUSD.last12Months,
      yearToDateUSD: expensesCOGSCleaningUSD.yearToDate,
      last3MonthsUSD: expensesCOGSCleaningUSD.last3Months,
      currentMonthUSD: expensesCOGSCleaningUSD.currentMonth,
      lastMonthPreviousYearUSD: expensesCOGSCleaningUSD.lastMonthPreviousYear,
      last12MonthsPreviousYearUSD: expensesCOGSCleaningUSD.last12MonthsPreviousYear,
      last3MonthsPreviousYearUSD: expensesCOGSCleaningUSD.last3MonthsPreviousYear,
      totalMXN: expensesCOGSCleaningMXN.total,
      lastMonthMXN: expensesCOGSCleaningMXN.lastMonth,
      last12MonthsMXN: expensesCOGSCleaningMXN.last12Months,
      yearToDateMXN: expensesCOGSCleaningMXN.yearToDate,
      last3MonthsMXN: expensesCOGSCleaningMXN.last3Months,
      currentMonthMXN: expensesCOGSCleaningMXN.currentMonth,
      lastMonthPreviousYearMXN: expensesCOGSCleaningMXN.lastMonthPreviousYear,
      last12MonthsPreviousYearMXN: expensesCOGSCleaningMXN.last12MonthsPreviousYear,
      last3MonthsPreviousYearMXN: expensesCOGSCleaningMXN.last3MonthsPreviousYear,
    };

    const expensesCOGSData = {
      totalUSD: expensesCOGSPlatformFeesData.totalUSD + expensesCOGSPropertyManagementFeesData.totalUSD + expensesCOGSConsumablesData.totalUSD + expensesCOGSCleaningData.totalUSD,
      lastMonthUSD: expensesCOGSPlatformFeesData.lastMonthUSD + expensesCOGSPropertyManagementFeesData.lastMonthUSD + expensesCOGSConsumablesData.lastMonthUSD + expensesCOGSCleaningData.lastMonthUSD,
      last12MonthsUSD: expensesCOGSPlatformFeesData.last12MonthsUSD + expensesCOGSPropertyManagementFeesData.last12MonthsUSD + expensesCOGSConsumablesData.last12MonthsUSD + expensesCOGSCleaningData.last12MonthsUSD,
      yearToDateUSD: expensesCOGSPlatformFeesData.yearToDateUSD + expensesCOGSPropertyManagementFeesData.yearToDateUSD + expensesCOGSConsumablesData.yearToDateUSD + expensesCOGSCleaningData.yearToDateUSD,
      last3MonthsUSD: expensesCOGSPlatformFeesData.last3MonthsUSD + expensesCOGSPropertyManagementFeesData.last3MonthsUSD + expensesCOGSConsumablesData.last3MonthsUSD + expensesCOGSCleaningData.last3MonthsUSD,
      currentMonthUSD: expensesCOGSPlatformFeesData.currentMonthUSD + expensesCOGSPropertyManagementFeesData.currentMonthUSD + expensesCOGSConsumablesData.currentMonthUSD + expensesCOGSCleaningData.currentMonthUSD,
      totalMXN: expensesCOGSPlatformFeesData.totalMXN + expensesCOGSPropertyManagementFeesData.totalMXN + expensesCOGSConsumablesData.totalMXN + expensesCOGSCleaningData.totalMXN,
      lastMonthMXN: expensesCOGSPlatformFeesData.lastMonthMXN + expensesCOGSPropertyManagementFeesData.lastMonthMXN + expensesCOGSConsumablesData.lastMonthMXN + expensesCOGSCleaningData.lastMonthMXN,
      last12MonthsMXN: expensesCOGSPlatformFeesData.last12MonthsMXN + expensesCOGSPropertyManagementFeesData.last12MonthsMXN + expensesCOGSConsumablesData.last12MonthsMXN + expensesCOGSCleaningData.last12MonthsMXN,
      yearToDateMXN: expensesCOGSPlatformFeesData.yearToDateMXN + expensesCOGSPropertyManagementFeesData.yearToDateMXN + expensesCOGSConsumablesData.yearToDateMXN + expensesCOGSCleaningData.yearToDateMXN,
      last3MonthsMXN: expensesCOGSPlatformFeesData.last3MonthsMXN + expensesCOGSPropertyManagementFeesData.last3MonthsMXN + expensesCOGSConsumablesData.last3MonthsMXN + expensesCOGSCleaningData.last3MonthsMXN,
      currentMonthMXN: expensesCOGSPlatformFeesData.currentMonthMXN + expensesCOGSPropertyManagementFeesData.currentMonthMXN + expensesCOGSConsumablesData.currentMonthMXN + expensesCOGSCleaningData.currentMonthMXN,
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

    const result = await listingsCollection.updateOne(
      { 'property_id': propertyId }, // Match the property ID in MongoDB
      {
        $set: {
          'income': incomeData,
          'occupancy': occupancyData, // Update the occupancy field
          'expenses.platform_fees': expensesCOGSPlatformFeesData,
          'expenses.property_management_fees': expensesCOGSPropertyManagementFeesData,
          'expenses.consumables': expensesCOGSConsumablesData,
          'expenses.cleaning': expensesCOGSCleaningData,
          'expenses.cogs': expensesCOGSData,
          'expenses.sg&a': expensesSGAData, // Use bracket notation for setting
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