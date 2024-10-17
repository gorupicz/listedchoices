const { PrismaClient } = require('@prisma/client');

const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient();

async function connectToDatabase() {
  try {
    await prisma.$connect();
    console.log('Connected to MySQL');
  } catch (error) {
    console.error('Failed to connect to MySQL:', error);
  }
}

connectToDatabase();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

module.exports = prisma;
