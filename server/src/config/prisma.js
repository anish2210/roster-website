// Load environment variables first
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client with Accelerate URL for Prisma 7
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
  // Use accelerateUrl for Prisma Accelerate connection
  accelerateUrl: process.env.DATABASE_URL,
});

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
