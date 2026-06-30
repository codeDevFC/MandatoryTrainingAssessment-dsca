const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Updating modules - marking 8 and 17 as practical...\n');
  
  // Update Module 8
  await prisma.module.update({
    where: { id: 8 },
    data: { isPractical: true }
  });
  console.log('✅ Module 8 marked as practical (First Aid)');
  
  // Update Module 17
  await prisma.module.update({
    where: { id: 17 },
    data: { isPractical: true }
  });
  console.log('✅ Module 17 marked as practical (Moving & Handling)');
  
  // Verify
  const modules = await prisma.module.findMany({
    where: { isPractical: true },
    orderBy: { id: 'asc' }
  });
  
  console.log('\n📋 Practical modules in database:');
  modules.forEach(m => {
    console.log(`  - Module ${m.id}: ${m.name}`);
  });
  
  await prisma.$disconnect();
  console.log('\n✅ Update complete!');
}

main().catch(console.error);
