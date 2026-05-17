const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const code = await prisma.loginCode.findFirst({
    where: { email: 'demo.u@dsca.co.uk', code: '123456' }
  });
  console.log('Code found:', code ? 'YES' : 'NO');
  if (code) {
    console.log('Code:', code.code);
    console.log('Used:', code.used);
    console.log('Expires:', code.expiresAt);
  }
  
  await prisma.$disconnect();
  process.exit(0);
}

check();
