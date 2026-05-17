const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearExpiredCodes() {
  const result = await prisma.loginCode.deleteMany({
    where: {
      OR: [
        { used: true },
        { expiresAt: { lt: new Date() } }
      ]
    }
  });
  console.log(`✅ Cleared ${result.count} expired/used codes`);
  process.exit(0);
}

clearExpiredCodes();
