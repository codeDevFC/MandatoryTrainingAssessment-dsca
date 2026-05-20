const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

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

  // Create 23 modules with sample questions
  const modulesData = [
    { id: 1, name: "COSHH Awareness (Level 1)", passMark: 15, questions: [
      { id: "q1", text: "The main H&S legislation is the Health & Safety at Work (etc.) Act 1974.", options: ["True", "False"], correct: 0 },
      { id: "q2", text: "Great care needs to be taken when handling hazardous substances.", options: ["True", "False"], correct: 0 },
      { id: "q3", text: "You do not need to know details about chemicals you handle.", options: ["True", "False"], correct: 1 },
      { id: "q4", text: "There are many ways chemicals and substances can enter the body.", options: ["True", "False"], correct: 0 },
      { id: "q5", text: "Control of Substances Hazardous to Health covers many products.", options: ["True", "False"], correct: 0 },
      { id: "q6", text: "Bleach is not a hazardous substance.", options: ["True", "False"], correct: 1 },
      { id: "q7", text: "You can get contaminated through dust in the air.", options: ["True", "False"], correct: 0 },
      { id: "q8", text: "Blood is not considered a hazardous substance.", options: ["True", "False"], correct: 1 },
      { id: "q9", text: "You need to read the data sheets before using chemicals.", options: ["True", "False"], correct: 0 },
      { id: "q10", text: "Everyday products are always safe to use.", options: ["True", "False"], correct: 1 },
      { id: "q11", text: "Employers do not have to provide training about COSHH.", options: ["True", "False"], correct: 1 },
      { id: "q12", text: "Employees do have to wear protective equipment provided.", options: ["True", "False"], correct: 0 },
      { id: "q13", text: "Even some plants and bulbs are considered as hazardous.", options: ["True", "False"], correct: 0 },
      { id: "q14", text: "A needle stick injury can cause infection.", options: ["True", "False"], correct: 0 },
      { id: "q15", text: "You should report all spills of chemicals, no matter how small.", options: ["True", "False"], correct: 0 },
      { id: "q16", text: "Employers face fines if they do not comply with COSHH Regulations.", options: ["True", "False"], correct: 0 },
      { id: "q17", text: "All COSHH hazards can be seen.", options: ["True", "False"], correct: 1 },
      { id: "q18", text: "Personal Protective Equipment must be worn where required.", options: ["True", "False"], correct: 0 },
      { id: "q19", text: "Home chemicals are always safe to use.", options: ["True", "False"], correct: 1 },
      { id: "q20", text: "I have a duty of care to myself and others with regard to COSHH.", options: ["True", "False"], correct: 0 }
    ]},
    { id: 2, name: "Dementia Awareness (Level 1)", passMark: 15, questions: [
      { id: "q1", text: "Dementia affects people from all walks of life.", options: ["True", "False"], correct: 0 },
      { id: "q2", text: "A person with dementia may display a variety of symptoms.", options: ["True", "False"], correct: 0 },
      { id: "q3", text: "If a person with dementia shouts at you, then you should shout back.", options: ["True", "False"], correct: 1 },
      { id: "q4", text: "We should support the relationships of a person with dementia.", options: ["True", "False"], correct: 0 },
      { id: "q5", text: "A person with dementia has a life history that is important.", options: ["True", "False"], correct: 0 },
      { id: "q6", text: "There is no need for service user's information to be kept confidential.", options: ["True", "False"], correct: 1 },
      { id: "q7", text: "It is acceptable to patronise people with dementia.", options: ["True", "False"], correct: 1 },
      { id: "q8", text: "A person with dementia may be repetitive in actions and speech.", options: ["True", "False"], correct: 0 },
      { id: "q9", text: "You should take insults from a person with dementia personally.", options: ["True", "False"], correct: 1 },
      { id: "q10", text: "Dementia is not an inevitable consequence of getting older.", options: ["True", "False"], correct: 0 },
      { id: "q11", text: "Alzheimer's is a type of dementia.", options: ["True", "False"], correct: 0 },
      { id: "q12", text: "There is no cure for Alzheimer's.", options: ["True", "False"], correct: 0 },
      { id: "q13", text: "Difficulty in expressing thoughts could be a symptom of dementia.", options: ["True", "False"], correct: 0 },
      { id: "q14", text: "90% of all communication is non-verbal.", options: ["True", "False"], correct: 0 },
      { id: "q15", text: "Loss of memory causes no distress to people suffering dementia.", options: ["True", "False"], correct: 1 },
      { id: "q16", text: "Huntington's is a type of dementia.", options: ["True", "False"], correct: 0 },
      { id: "q17", text: "The cause of dementia, as yet, remains unknown.", options: ["True", "False"], correct: 0 },
      { id: "q18", text: "Dementia can be associated to a person's race, gender or culture.", options: ["True", "False"], correct: 1 },
      { id: "q19", text: "Dementia is an illness, sometimes referred to as brain failure.", options: ["True", "False"], correct: 0 },
      { id: "q20", text: "There is no need to listen carefully to people with dementia.", options: ["True", "False"], correct: 1 }
    ]}
  ];

  // Add modules 3-23
  const moduleNames = [
    "Effective Communication (Level 1)",
    "End of Life Care (Level 1)",
    "Epilepsy Awareness (Level 2)",
    "Equality & Diversity (Level 1)",
    "Fire Safety (Level 1)",
    "First Aid Basic Life Support (Level 1)",
    "Food Hygiene (Level 1)",
    "Food Hygiene (Level 2)",
    "Health & Safety (Level 1)",
    "Infection Control (Level 2)",
    "Medication Awareness (Level 1)",
    "Medication Awareness (Level 2)",
    "Mental Capacity Act & DOLS (Level 1)",
    "Nutrition & Fluids (Level 1)",
    "People Movers Moving & Handling (Level 1)",
    "Person Centred Care (Level 1)",
    "Personal & Pressure Care (Level 1)",
    "Safeguarding Adults at Risk (Level 1)",
    "Safeguarding Adults at Risk (Level 2)",
    "Safeguarding Children (Level 1)",
    "Understanding Your Role & Duty of Care (Level 1)"
  ];

  for (let i = 0; i < moduleNames.length; i++) {
    const moduleId = i + 3;
    const sampleQuestions = Array(20).fill(null).map((_, idx) => ({
      id: `q${idx + 1}`,
      text: `Sample question ${idx + 1} for ${moduleNames[i]}. Please update with actual content.`,
      options: ["True", "False"],
      correct: 0
    }));
    modulesData.push({
      id: moduleId,
      name: moduleNames[i],
      passMark: 15,
      questions: sampleQuestions
    });
  }

  // Insert modules - convert questions to JSON string
  for (const module of modulesData) {
    await prisma.module.upsert({
      where: { id: module.id },
      update: {
        name: module.name,
        passMark: module.passMark,
        questions: JSON.stringify(module.questions)  // ← FIX: Convert to JSON string
      },
      create: {
        id: module.id,
        name: module.name,
        passMark: module.passMark,
        questions: JSON.stringify(module.questions)  // ← FIX: Convert to JSON string
      }
    });
    console.log(`✅ Created module ${module.id}: ${module.name}`);
  }

  console.log('\n✅ Seeding complete!');
  console.log('\n🔐 Login Credentials:');
  console.log('   Admin: admin@careworks.com / Admin@2025');
  console.log('   Director: director@careworks.com / Director@2025');
  console.log('   Supervisor: supervisor@careworks.com / Supervisor@2025');
  console.log('\n📊 Database ready!');
}

main()
  .catch(e => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
