const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  console.log('\n📊 Remote Database Verification:\n');
  
  const users = await prisma.user.findMany();
  console.log(`👤 Users (${users.length}):`);
  users.forEach(u => console.log(`   - ${u.email} (${u.role})`));
  
  const modules = await prisma.module.findMany({
    orderBy: { id: 'asc' }
  });
  console.log(`\n📚 Modules (${modules.length}):`);
  for (const m of modules) {
    const questions = JSON.parse(m.questions);
    console.log(`   - ${m.id}: ${m.name} (${questions.length} questions, pass: ${m.passMark}/20)`);
  }
  
  await prisma.$disconnect();
}

verify();
