const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const codes = await prisma.loginCode.findMany({
    where: { used: false },
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  
  console.log('Recent active codes:\n');
  
  if (codes.length === 0) {
    console.log('No active codes found!');
  } else {
    for (const c of codes) {
      console.log(`Email: ${c.email}`);
      console.log(`Code: ${c.code}`);
      console.log(`Expires: ${c.expiresAt}`);
      console.log('---');
    }
  }
  
  await prisma.$disconnect();
}

check();
