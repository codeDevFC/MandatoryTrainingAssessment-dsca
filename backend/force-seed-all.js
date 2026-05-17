const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const allModules = [
  { id: 1, name: "COSHH Awareness (Level 1)", questions: 20 },
  { id: 2, name: "Dementia Awareness (Level 1)", questions: 10 },
  { id: 3, name: "Effective Communication (Level 1)", questions: 20 },
  { id: 4, name: "End of Life Care (Level 1)", questions: 10 },
  { id: 5, name: "Epilepsy Awareness (Level 2)", questions: 10 },
  { id: 6, name: "Equality & Diversity (Level 1)", questions: 10 },
  { id: 7, name: "Fire Safety (Level 1)", questions: 20 },
  { id: 8, name: "First Aid Basic Life Support (Level 1)", questions: 10 },
  { id: 9, name: "Food Hygiene (Level 1)", questions: 20 },
  { id: 10, name: "Food Hygiene (Level 2)", questions: 20 },
  { id: 11, name: "Health & Safety (Level 1)", questions: 11 },
  { id: 12, name: "Infection Control (Level 2)", questions: 18 },
  { id: 13, name: "Medication Awareness (Level 1)", questions: 20 },
  { id: 14, name: "Medication Awareness (Level 2)", questions: 18 },
  { id: 15, name: "Mental Capacity Act & DOLS (Level 1)", questions: 10 },
  { id: 16, name: "Nutrition & Fluids (Level 1)", questions: 11 },
  { id: 17, name: "People Movers Moving & Handling (Level 1)", questions: 10 },
  { id: 18, name: "Person Centred Care (Level 1)", questions: 10 },
  { id: 19, name: "Personal & Pressure Care (Level 1)", questions: 20 },
  { id: 20, name: "Safeguarding Adults at Risk (Level 1)", questions: 20 },
  { id: 21, name: "Safeguarding Adults at Risk (Level 2)", questions: 18 },
  { id: 22, name: "Safeguarding Children (Level 1)", questions: 10 },
  { id: 23, name: "Understanding Your Role & Duty of Care (Level 1)", questions: 10 }
];

async function seed() {
  console.log('🌱 Seeding all 23 modules...\n');
  
  for (const module of allModules) {
    const passMark = Math.ceil(module.questions * 0.75);
    
    await prisma.module.upsert({
      where: { id: module.id },
      update: {
        name: module.name,
        passMark: passMark,
        questions: []
      },
      create: {
        id: module.id,
        name: module.name,
        passMark: passMark,
        questions: []
      }
    });
    
    console.log(`✅ Module ${module.id}: ${module.name} - Pass mark: ${passMark}/${module.questions}`);
  }
  
  console.log(`\n🎉 Successfully seeded ${allModules.length} modules!`);
  await prisma.$disconnect();
}

seed();
