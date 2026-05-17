const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function create() {
  const email = 'demo@dsca.co.uk';
  const code = '123456';
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  
  // Delete existing
  await prisma.loginCode.deleteMany({ where: { email } });
  
  // Create user
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: { 
        email, 
        name: 'Demo User', 
        role: 'TRAINEE', 
        trainingRoute: 'FULL_22' 
      }
    });
    console.log('Created user:', email);
  }
  
  // Create code
  const result = await prisma.loginCode.create({
    data: { email, code, expiresAt }
  });
  
  console.log('\n✅ TEST CREDENTIALS:');
  console.log(`   Email: ${email}`);
  console.log(`   Code: ${code}`);
  console.log(`   Expires: ${expiresAt}\n`);
  
  // Verify
  const verify = await prisma.loginCode.findFirst({
    where: { email, code, used: false }
  });
  console.log('Verification:', verify ? 'SUCCESS - Code exists in database' : 'FAILED');
  
  await prisma.$disconnect();
}

create();
