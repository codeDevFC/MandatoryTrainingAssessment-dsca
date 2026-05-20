const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  console.log('\n📊 Database Verification:\n');
  
  const users = await prisma.user.findMany();
  console.log(`👤 Users (${users.length}):`);
  users.forEach(u => console.log(`   - ${u.email} (${u.role})`));
  
  const modules = await prisma.module.findMany({
    orderBy: { id: 'asc' }
  });
  console.log(`\n📚 Modules (${modules.length}):`);
  modules.forEach(m => {
    const qCount = JSON.parse(m.questions).length;
    console.log(`   - ${m.id}: ${m.name} (${qCount} questions, pass: ${m.passMark}/20)`);
  });
  
  await prisma.$disconnect();
}

verify();
