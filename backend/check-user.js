const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    // Check user
    const user = await prisma.user.findUnique({
      where: { email: 'jefa@coht.co.uk' },
      select: { 
        id: true, 
        email: true, 
        name: true, 
        role: true, 
        trainingRoute: true,
        practicalModules: true
      }
    });
    console.log('User found:', user ? 'YES' : 'NO');
    if (user) {
      console.log('User details:', JSON.stringify(user, null, 2));
    }

    // Check login codes
    const codes = await prisma.loginCode.findMany({
      where: { email: 'jefa@coht.co.uk' },
      select: { code: true, expiresAt: true, used: true }
    });
    console.log('Login codes:', codes);

    // Check if code is valid
    const validCode = await prisma.loginCode.findFirst({
      where: {
        email: 'jefa@coht.co.uk',
        code: '428963',
        expiresAt: { gt: new Date() }
      }
    });
    console.log('Valid login code (428963):', validCode ? 'YES' : 'NO');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
