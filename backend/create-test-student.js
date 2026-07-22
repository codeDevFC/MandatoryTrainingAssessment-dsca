const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestData() {
  try {
    // Check if test student exists
    let user = await prisma.user.findUnique({
      where: { email: 'test.student@coht.co.uk' }
    });
    
    if (!user) {
      // Create test student
      user = await prisma.user.create({
        data: {
          email: 'test.student@coht.co.uk',
          name: 'Test Student',
          role: 'TRAINEE',
          trainingRoute: 'FULL_ACCESS',
          paymentConfirmed: true,
          practicalModules: '{}'
        }
      });
      console.log('✅ Test student created:', user.email);
      console.log('   ID:', user.id);
    } else {
      console.log('✅ Test student already exists:', user.email);
      console.log('   ID:', user.id);
    }
    
    console.log('\n📋 Now login as Admin and:');
    console.log('   1. Go to Students tab');
    console.log('   2. Find the test student');
    console.log('   3. Click "Details" and "Generate Code"');
    console.log('   4. Login as the test student');
    console.log('   5. Complete a module');
    console.log('   6. Then test the Report!');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData();
