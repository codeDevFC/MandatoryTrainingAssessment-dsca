const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany();
    console.log('\n📊 Users in database:', users.length);
    users.forEach(u => {
      console.log(`   - ${u.email} (${u.role})`);
    });
    
    if (users.length === 0) {
      console.log('\n❌ No users found! Need to create admin users.');
    }
    await prisma.$disconnect();
  } catch (e) {
    console.error('Error:', e.message);
  }
}

checkUsers();
