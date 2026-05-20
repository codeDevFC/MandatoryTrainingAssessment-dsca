const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Neon database...\n');

  // Create admin users
  const admins = [
    { email: 'admin@careworks.com', name: 'System Admin', role: 'ADMIN' },
    { email: 'director@careworks.com', name: 'Director', role: 'DIRECTOR' },
    { email: 'supervisor@careworks.com', name: 'Supervisor', role: 'SUPERVISOR' }
  ];

  for (const admin of admins) {
    await prisma.user.upsert({
      where: { email: admin.email },
      update: {},
      create: admin
    });
    console.log(`✅ Created ${admin.role}: ${admin.email}`);
  }

  // Module names for all 23 modules
  const moduleNames = {
    1: "COSHH Awareness (Level 1)",
    2: "Dementia Awareness (Level 1)",
    3: "Effective Communication (Level 1)",
    4: "End of Life Care (Level 1)",
    5: "Epilepsy Awareness (Level 2)",
    6: "Equality & Diversity (Level 1)",
    7: "Fire Safety (Level 1)",
    8: "First Aid Basic Life Support (Level 1)",
    9: "Food Hygiene (Level 1)",
    10: "Food Hygiene (Level 2)",
    11: "Health & Safety (Level 1)",
    12: "Infection Control (Level 2)",
    13: "Medication Awareness (Level 1)",
    14: "Medication Awareness (Level 2)",
    15: "Mental Capacity Act & DOLS (Level 1)",
    16: "Nutrition & Fluids (Level 1)",
    17: "People Movers Moving & Handling (Level 1)",
    18: "Person Centred Care (Level 1)",
    19: "Personal & Pressure Care (Level 1)",
    20: "Safeguarding Adults at Risk (Level 1)",
    21: "Safeguarding Adults at Risk (Level 2)",
    22: "Safeguarding Children (Level 1)",
    23: "Understanding Your Role & Duty of Care (Level 1)"
  };

  // Create modules 1-23
  for (let i = 1; i <= 23; i++) {
    // Create 20 sample questions for each module
    const questions = [];
    for (let q = 1; q <= 20; q++) {
      questions.push({
        id: `mod${i}_q${q}`,
        text: `Question ${q} for ${moduleNames[i]}. This is a sample question.`,
        options: ["True", "False"],
        correct: 0
      });
    }
    
    await prisma.module.upsert({
      where: { id: i },
      update: {},
      create: {
        id: i,
        name: moduleNames[i],
        passMark: 15,
        questions: JSON.stringify(questions)
      }
    });
    console.log(`✅ Created module ${i}: ${moduleNames[i]}`);
  }

  // Verify
  const userCount = await prisma.user.count();
  const moduleCount = await prisma.module.count();
  
  console.log('\n✅ Seeding complete!');
  console.log(`📊 Database has ${userCount} users and ${moduleCount} modules`);
  console.log('\n🔐 Login Credentials:');
  console.log('   Admin: admin@careworks.com / Admin@2025');
  console.log('   Director: director@careworks.com / Director@2025');
  console.log('   Supervisor: supervisor@careworks.com / Supervisor@2025');
  
  await prisma.$disconnect();
}

main().catch(e => {
  console.error('❌ Error:', e);
  process.exit(1);
});
