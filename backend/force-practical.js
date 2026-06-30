const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function forceUpdate() {
  try {
    console.log('🔄 Force updating modules 8 and 17 to be practical...\n');
    
    // Update Module 8
    const mod8 = await prisma.module.update({
      where: { id: 8 },
      data: { isPractical: true }
    });
    console.log(`✅ Module 8: ${mod8.name}`);
    console.log(`   isPractical: ${mod8.isPractical}`);
    
    // Update Module 17
    const mod17 = await prisma.module.update({
      where: { id: 17 },
      data: { isPractical: true }
    });
    console.log(`✅ Module 17: ${mod17.name}`);
    console.log(`   isPractical: ${mod17.isPractical}`);
    
    // Verify all practical modules
    const practical = await prisma.module.findMany({
      where: { isPractical: true },
      orderBy: { id: 'asc' },
      select: { id: true, name: true, isPractical: true }
    });
    
    console.log('\n📋 All practical modules:');
    practical.forEach(m => {
      console.log(`  🔐 Module ${m.id}: ${m.name}`);
    });
    
    console.log('\n✅ Update complete!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

forceUpdate();
