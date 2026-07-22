const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'TRAINEE' },
      include: {
        moduleAttempts: {
          take: 1
        }
      },
      take: 5
    });
    
    console.log('📊 Students in database:');
    if (students.length === 0) {
      console.log('⚠️ No students found. You may need to create a test student.');
    } else {
      students.forEach(s => {
        const attempts = s.moduleAttempts?.length || 0;
        console.log(`  - ${s.name || s.email}: ${attempts} module attempts`);
      });
    }
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
