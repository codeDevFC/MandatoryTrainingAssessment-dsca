const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  try {
    const count = await prisma.user.count();
    console.log('✅ Database connected! Users:', count);
  } catch (err) {
    console.error('❌ Database error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
