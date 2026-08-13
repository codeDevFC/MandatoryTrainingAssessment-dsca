const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    // Check practical codes in the system
    const activeCode = await prisma.practicalAccessCode.findFirst({
      where: { isActive: true },
      orderBy: { generatedAt: 'desc' }
    });
    console.log('Active practical code:', activeCode);

    // Check user's practical modules
    const user = await prisma.user.findUnique({
      where: { email: 'jefa@coht.co.uk' },
      select: { 
        id: true, 
        email: true, 
        practicalModules: true,
        trainingRoute: true
      }
    });
    console.log('\nUser practicalModules:', user?.practicalModules);
    
    // Parse and display practical modules
    if (user?.practicalModules) {
      try {
        const parsed = JSON.parse(user.practicalModules);
        console.log('\nParsed practical modules:', parsed);
      } catch(e) {
        console.log('Error parsing practicalModules:', e.message);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
