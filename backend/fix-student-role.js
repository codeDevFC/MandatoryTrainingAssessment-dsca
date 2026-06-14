const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixRoles() {
  console.log('🔧 Fixing student roles...');
  
  // Update all students where role is not an admin role to TRAINEE
  const result = await prisma.user.updateMany({
    where: {
      AND: [
        { role: { not: 'ADMIN' } },
        { role: { not: 'DIRECTOR' } },
        { role: { not: 'SUPERVISOR' } },
        { role: { not: 'TRAINEE' } }
      ]
    },
    data: {
      role: 'TRAINEE'
    }
  });
  
  console.log(`✅ Updated ${result.count} students to role TRAINEE`);
  
  // List all students with their roles
  const students = await prisma.user.findMany({
    where: { role: 'TRAINEE' },
    select: { name: true, email: true, role: true, paymentConfirmed: true }
  });
  
  console.log(`\n📊 Total TRAINEE students: ${students.length}`);
  students.forEach(s => {
    console.log(`   - ${s.name || s.email} (Role: ${s.role}, Payment: ${s.paymentConfirmed ? 'Confirmed' : 'Pending'})`);
  });
  
  await prisma.$disconnect();
}

fixRoles().catch(console.error);
