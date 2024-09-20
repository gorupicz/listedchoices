const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const exchangeRates = [
    { year: 2023, month: 1, value: 18.99 },
    { year: 2023, month: 2, value: 18.60 },
    { year: 2023, month: 3, value: 18.37 },
    { year: 2023, month: 4, value: 18.09 },
    { year: 2023, month: 5, value: 17.74 },
    { year: 2023, month: 6, value: 17.24 },
    { year: 2023, month: 7, value: 16.90 },
    { year: 2023, month: 8, value: 16.98 },
    { year: 2023, month: 9, value: 17.31 },
    { year: 2023, month: 10, value: 18.08 },
    { year: 2023, month: 11, value: 17.38 },
    { year: 2023, month: 12, value: 17.19 },
    { year: 2024, month: 1, value: 17.09 },
    { year: 2024, month: 2, value: 17.09 },
    { year: 2024, month: 3, value: 16.79 },
    { year: 2024, month: 4, value: 16.81 },
    { year: 2024, month: 5, value: 16.79 },
    { year: 2024, month: 6, value: 18.22 },
    { year: 2024, month: 7, value: 18.11 },
    { year: 2024, month: 8, value: 19.15 },
  ];

  await prisma.exchangeRate.createMany({
    data: exchangeRates,
  });

  console.log('Exchange rates seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
