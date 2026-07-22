const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedAdmin() {
  console.log('🌱 Seeding admin users...');
  
  const admins = [
    { email: 'admin@careworks.com', name: 'Admin', role: 'ADMIN' },
    { email: 'director@careworks.com', name: 'Director', role: 'DIRECTOR' },
    { email: 'supervisor@careworks.com', name: 'Supervisor', role: 'SUPERVISOR' }
  ];
  
  for (const admin of admins) {
    try {
      const user = await prisma.user.upsert({
        where: { email: admin.email },
        update: { 
          role: admin.role,
          trainingRoute: 'FULL_ACCESS',
          paymentConfirmed: true,
          practicalModules: '{}'
        },
        create: {
          email: admin.email,
          name: admin.name,
          role: admin.role,
          trainingRoute: 'FULL_ACCESS',
          paymentConfirmed: true,
          practicalModules: '{}'
        }
      });
      console.log(`✅ ${admin.email} (${admin.role}) created/updated`);
    } catch (e) {
      console.error(`❌ Failed to create ${admin.email}:`, e.message);
    }
  }
  
  // Also seed a test student
  try {
    const student = await prisma.user.upsert({
      where: { email: 'abct@coht.co.uk' },
      update: {
        name: 'Test Student',
        trainingRoute: 'FULL_ACCESS',
        paymentConfirmed: true,
        practicalModules: JSON.stringify({
          "8": { completed: true, completedAt: new Date().toISOString(), code: "J4CZA3X0" },
          "17": { completed: true, completedAt: new Date().toISOString(), code: "J4CZA3X0" }
        })
      },
      create: {
        email: 'abct@coht.co.uk',
        name: 'Test Student',
        role: 'TRAINEE',
        trainingRoute: 'FULL_ACCESS',
        paymentConfirmed: true,
        practicalModules: JSON.stringify({
          "8": { completed: true, completedAt: new Date().toISOString(), code: "J4CZA3X0" },
          "17": { completed: true, completedAt: new Date().toISOString(), code: "J4CZA3X0" }
        })
      }
    });
    console.log(`✅ Test student (abct@coht.co.uk) created/updated`);
  } catch (e) {
    console.error('❌ Failed to create test student:', e.message);
  }
  
  await prisma.$disconnect();
  console.log('✅ Seeding complete!');
}

seedAdmin().catch(console.error);
