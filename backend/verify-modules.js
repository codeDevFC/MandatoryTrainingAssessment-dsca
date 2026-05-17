const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const modules = await prisma.module.findMany({
    orderBy: { id: 'asc' },
    select: { id: true, name: true }
  });

  console.log('\n📚 All Modules in Database:\n');
  modules.forEach(m => {
    console.log(`  ${m.id}. ${m.name}`);
  });

  console.log(`\n✅ Total: ${modules.length} modules`);

  await prisma.$disconnect();
}

check();
