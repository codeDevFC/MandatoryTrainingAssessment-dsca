const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function create() {
  try {
    // Check if user exists
    let user = await prisma.user.findUnique({ 
      where: { email: 'demo.u@dsca.co.uk' } 
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: { 
          email: 'demo.u@dsca.co.uk', 
          name: 'Demo User', 
          role: 'TRAINEE', 
          trainingRoute: 'FULL_22' 
        }
      });
      console.log('✅ Created user:', user.email);
    } else {
      console.log('User exists:', user.email);
    }
    
    // Delete any existing codes
    await prisma.loginCode.deleteMany({ 
      where: { email: 'demo.u@dsca.co.uk' } 
    });
    console.log('Cleared old codes');
    
    // Create new code
    const code = '123456';
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const result = await prisma.loginCode.create({
      data: { 
        email: 'demo.u@dsca.co.uk', 
        code: code, 
        expiresAt: expiresAt 
      }
    });
    console.log('✅ Created code:', result.code, 'for', result.email);
    console.log('Expires:', result.expiresAt);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await prisma.$disconnect();
  process.exit(0);
}

create();
