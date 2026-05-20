const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  console.log('\n📊 Final Database Verification:\n');
  
  const modules = await prisma.module.findMany({ orderBy: { id: 'asc' } });
  console.log(`📚 Total Modules: ${modules.length}\n`);
  
  let totalQuestions = 0;
  for (const m of modules) {
    const questions = JSON.parse(m.questions);
    totalQuestions += questions.length;
    console.log(`   Module ${m.id}: ${m.name}`);
    console.log(`      - Questions: ${questions.length}`);
    console.log(`      - Pass Mark: ${m.passMark}/20`);
    console.log(`      - First Question: ${questions[0]?.text.substring(0, 60)}...`);
    console.log('');
  }
  
  console.log(`📊 Total Questions across all modules: ${totalQuestions}`);
  console.log(`✅ Expected: 23 modules × 20 questions = 460 questions`);
  
  await prisma.$disconnect();
}

verify();
