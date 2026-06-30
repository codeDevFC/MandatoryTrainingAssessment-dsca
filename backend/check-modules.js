const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkModules() {
  try {
    console.log('📋 Checking modules in database...\n');
    
    const modules = await prisma.module.findMany({
      orderBy: { id: 'asc' },
      select: { id: true, name: true, isPractical: true }
    });
    
    console.log('All modules:');
    modules.forEach(m => {
      const status = m.isPractical ? '🔐 PRACTICAL' : '📘 Standard';
      console.log(`  ${String(m.id).padStart(2)}. ${m.name.padEnd(45)} ${status}`);
    });
    
    // Specifically check modules 8 and 17
    console.log('\n🔍 Specific check for modules 8 and 17:');
    const mod8 = modules.find(m => m.id === 8);
    const mod17 = modules.find(m => m.id === 17);
    
    if (mod8) {
      console.log(`  Module 8: ${mod8.name} - isPractical: ${mod8.isPractical}`);
    } else {
      console.log('  Module 8: NOT FOUND');
    }
    
    if (mod17) {
      console.log(`  Module 17: ${mod17.name} - isPractical: ${mod17.isPractical}`);
    } else {
      console.log('  Module 17: NOT FOUND');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkModules();
