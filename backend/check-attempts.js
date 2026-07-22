const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAttempts() {
  try {
    const attempts = await prisma.moduleAttempt.findMany({
      include: {
        user: true,
        module: true
      },
      take: 10,
      orderBy: {
        completedAt: 'desc'
      }
    });
    
    console.log('📊 Recent Module Attempts:');
    if (attempts.length === 0) {
      console.log('⚠️ No module attempts found.');
      console.log('   You need to complete a module first to test the report.');
    } else {
      attempts.forEach(a => {
        console.log(`  - ${a.user?.name || a.user?.email || 'Unknown'}: ${a.module?.name || 'Unknown Module'}`);
        console.log(`    Score: ${a.score}/20 (${a.passed ? 'PASSED ✅' : 'FAILED ❌'})`);
        console.log(`    Completed: ${new Date(a.completedAt).toLocaleString()}`);
        console.log(`    Has detailedAnswers: ${a.detailedAnswers ? 'Yes ✅' : 'No ❌'}`);
        console.log('');
      });
    }
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAttempts();
