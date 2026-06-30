const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function generatePracticalCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function createCode() {
  try {
    // Deactivate old codes
    await prisma.practicalAccessCode.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });
    
    const newCode = generatePracticalCode();
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    
    const code = await prisma.practicalAccessCode.create({
      data: {
        code: newCode,
        isActive: true,
        expiresAt: expiresAt,
        generatedBy: 'admin'
      }
    });
    
    console.log('\n🔐 PRACTICAL CODE GENERATED:');
    console.log('=====================================');
    console.log(`  Code: ${code.code}`);
    console.log(`  Expires: ${new Date(code.expiresAt).toLocaleDateString()}`);
    console.log('=====================================');
    console.log('\n✅ Share this code with trainees for Modules 8 and 17');
    
  } catch (error) {
    console.error('Error generating code:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createCode();
