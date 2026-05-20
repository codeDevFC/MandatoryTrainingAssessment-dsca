const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixRoles() {
  console.log('🔧 Fixing admin roles...\n');
  
  // Update admin@careworks.com to ADMIN role
  await prisma.user.update({
    where: { email: 'admin@careworks.com' },
    data: { role: 'ADMIN' }
  });
  console.log('✅ Updated admin@careworks.com to ADMIN');
  
  // Update director@careworks.com to DIRECTOR role
  await prisma.user.update({
    where: { email: 'director@careworks.com' },
    data: { role: 'DIRECTOR' }
  });
  console.log('✅ Updated director@careworks.com to DIRECTOR');
  
  // Update supervisor@careworks.com to SUPERVISOR role
  await prisma.user.update({
    where: { email: 'supervisor@careworks.com' },
    data: { role: 'SUPERVISOR' }
  });
  console.log('✅ Updated supervisor@careworks.com to SUPERVISOR');
  
  // Verify the updates
  console.log('\n📊 Updated users:');
  const admins = await prisma.user.findMany({
    where: {
      email: {
        in: ['admin@careworks.com', 'director@careworks.com', 'supervisor@careworks.com']
      }
    }
  });
  admins.forEach(u => {
    console.log(`   - ${u.email} (${u.role})`);
  });
  
  await prisma.$disconnect();
}

fixRoles();
