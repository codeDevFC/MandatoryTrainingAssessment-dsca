const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  console.log('\n📊 DATABASE VERIFICATION\n');
  console.log('='.repeat(50));
  
  const modules = await prisma.module.findMany({
    orderBy: { id: 'asc' }
  });
  
  console.log(`\n📚 Total Modules: ${modules.length}\n`);
  
  modules.forEach(m => {
    let qCount = 0;
    try {
      qCount = JSON.parse(m.questions).length;
    } catch(e) { qCount = 0; }
    
    const practical = m.isPractical ? '🔐 PRACTICAL' : '📘 Standard';
    console.log(`  ${m.id.toString().padStart(2)}. ${m.name.padEnd(40)} ${qCount} questions ${practical}`);
  });
  
  await prisma.$disconnect();
}

verify().catch(console.error);
