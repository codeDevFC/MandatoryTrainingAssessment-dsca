const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const modulesData = [
  // Modules 1-11 already exist, adding 12-23
  {
    id: 12,
    name: "Infection Control (Level 2)",
    questions: [
      "Good infection prevention practices protect everyone.",
      "HIV and hepatitis B infections cannot be cured.",
      "Correct routine hand washing removes transient microorganisms.",
      "Handwashing will reduce the spread of infection in healthcare settings.",
      "There are six links in the chain of infection.",
      "Sterilization is one of the levels of decontamination.",
      "A separate pair of gloves must be used for each client.",
      "Housekeeping will reduce the number of microorganisms at work.",
      "Everyone who handles medical waste is at risk of infections and injury.",
      "When cleaning up spills of bodily fluids gloves should always be worn.",
      "There is a need for Infection Control Risk Assessments.",
      "Breaking a hypodermic needle before disposal is not acceptable.",
      "Carrying unprotected sharps around the premises is a risk.",
      "All employees have a role with regards to infection control.",
      "All employees should receive infection control training.",
      "The law states that notifiable diseases must be reported.",
      "Proper disposal of medical waste minimises the spread of infections.",
      "Disposal of sharps must be in accordance with safety guidance."
    ],
    answers: [
      true, true, true, true, true, true, true, true, true, true,
      true, true, true, true, true, true, true, true
    ]
  },
  {
    id: 13,
    name: "Medication Awareness (Level 1)",
    questions: [
      "I need to be aware of the Medicine Act 1968.",
      "I do not need to be concerned about the Misuse of Drugs Act.",
      "Some people take medication to enable them to live their lives.",
      "Medication has no impact on preventing disease.",
      "Medication is sometimes taken to ensure normal body functions.",
      "Tablets are a form of medication that is taken.",
      "Drops, sprays and ointments are considered medication.",
      "I do not need to be aware of the contents of a MAR sheet.",
      "I should be observing for signs of side effects and other symptoms.",
      "An anaphylaxis reaction cannot kill someone.",
      "Anaphylaxis describes a serious allergic reaction.",
      "Anaphylaxis can lead to a cardiac arrest.",
      "There is no need to ensure you give the right dose of medication.",
      "If you make a mistake with medication you must report it immediately.",
      "You should ensure medication is taken at the right time.",
      "There is no need to sign the MAR sheet.",
      "There is no need to check for known allergies.",
      "Accurate and detailed recording is important with regard to medication.",
      "There is no need to check the expiry date of medication.",
      "You should always read the label on medication."
    ],
    answers: [
      true, false, true, false, true, true, true, false, true, false,
      true, true, false, true, true, false, false, true, false, true
    ]
  },
  {
    id: 14,
    name: "Medication Awareness (Level 2)",
    questions: [
      "Misuse of Drugs Act is medication legislation.",
      "I should be observing for side effects and other symptoms.",
      "Accurate and detailed recording is important regarding medication.",
      "Drops, sprays and ointments are considered medication.",
      "If you make a mistake with medication you must report it immediately.",
      "Be aware that Anaphylaxis can lead to a cardiac arrest.",
      "Correctly complete the MAR sheet.",
      "If in doubt about medication administration get your employer's advice.",
      "Always take care; there is always danger when handling medicine.",
      "Ensure the correct medication is given to the right service user.",
      "There is a need to check the expiry date of medication.",
      "Employees who administer medication should be competent.",
      "I must read and understand my employer's medication policy.",
      "I must follow the medication procedures of my employer.",
      "Employees should know the 7 Rights of Medication Administration.",
      "Never administer medications that are not labelled or unmarked.",
      "MAR sheet should be signed for each medication administered.",
      "Formal Medication Audits must be undertaken by the organisation."
    ],
    answers: [
      true, true, true, true, true, true, true, true, true, true,
      true, true, true, true, true, true, true, true
    ]
  },
  {
    id: 15,
    name: "Mental Capacity Act & DOLS (Level 1)",
    questions: [
      "Under the Mental Capacity Act any decision or act must be in a person's best interests.",
      "A record of a best interest decision must include consideration of the best interest checklist.",
      "It is good practice for professionals to carry out a proper assessment of a person's capacity.",
      "Any decision to deprive an individual of their liberty can be challenged.",
      "Someone's best interests cannot be based simply on age, appearance, or behaviour.",
      "Capacity assessments should be properly recorded.",
      "Best Interest Decisions don't always need a multi-disciplinary meeting.",
      "The person who chairs a best interest meeting may not always be the decision maker.",
      "A person without mental capacity can be physically restrained under section 5 of the Act in certain circumstances.",
      "The Mental Capacity Act applies to people aged 16 and over."
    ],
    answers: [
      true, true, true, true, false, true, false, true, true, true
    ]
  },
  {
    id: 16,
    name: "Nutrition & Fluids (Level 1)",
    questions: [
      "All service users should be assessed with regard to nutrition needs.",
      "We should ensure we provide nutritious food for those we care for.",
      "Carers have an important role to play in ensuring those they care for get nutritious food.",
      "Carers need to listen to the nutritional and fluid wishes of those they support.",
      "You should not ignore the requests of individuals for fluids.",
      "If in doubt about nutritional and fluid needs, I should check with my supervisor.",
      "There is a need to provide a choice of food for those we care for.",
      "On occasions, it may be necessary to record an individual's food and fluid intake.",
      "There is a need to take account of food allergies individuals may have.",
      "Communicating with the individual over their food and drink needs is important.",
      "Those who prepare food for individuals being cared for should understand nutritional value."
    ],
    answers: [
      true, true, true, true, false, true, false, true, false, true, true
    ]
  },
  {
    id: 17,
    name: "People Movers Moving & Handling (Level 1)",
    questions: [
      "Correct clothing and footwear should be worn when manual handling.",
      "Communication is important when moving an unconscious service user.",
      "You need to read the risk assessment before moving a person.",
      "The main muscles used during manual handling are the thigh muscles.",
      "You should always roll the service user towards you.",
      "You cannot lift a service user if they refuse to use the hoist.",
      "Both the service user and carer can get injured from moving and handling errors.",
      "I should report all moving and handling problems to my employer.",
      "Manual Handling accidents can happen anywhere, not just in the workplace.",
      "Everyone who moves loads is at risk of injury."
    ],
    answers: [
      true, true, false, true, true, false, false, true, false, true
    ]
  },
  {
    id: 18,
    name: "Person Centred Care (Level 1)",
    questions: [
      "Management should be focused on providing Person Centred Care.",
      "All employees should be trained to provide Person Centred Care.",
      "Employees should promote meaningful activities.",
      "Employees should be promoting dignity.",
      "Understanding a person's life history builds relationships.",
      "Service user's information needs to be kept confidential.",
      "A service user should not be forced to conform to the organisation's will.",
      "Team meetings are useful to review Person Centred Care.",
      "Helping a service user to engage in activities is important.",
      "Person Centred Planning needs to be reviewed regularly."
    ],
    answers: [
      true, true, false, true, true, false, false, true, false, true
    ]
  },
  {
    id: 19,
    name: "Personal & Pressure Care (Level 1)",
    questions: [
      "A person receiving personal care may feel embarrassed.",
      "Personal care requires special knowledge and training.",
      "Carers need to monitor sores and dressings.",
      "Pressure sores are graded by classification.",
      "The dignity of a person is important when assisting with personal care.",
      "You should be guided by the service user and the care plan.",
      "The feelings of the service user are important.",
      "Personal care includes ensuring personal hygiene.",
      "There are four grades of pressure ulcer classification (not eight).",
      "When changing pads you need to wear gloves.",
      "Always prepare the environment before performing personal care.",
      "Always communicate with the service user to establish their wishes.",
      "Always wash your hands before and after assisting with care.",
      "You should not dispose of soiled items in any way you like.",
      "If in doubt about personal care I should check with my supervisor.",
      "The range of personal care requirements is not limited.",
      "Smell from a dressing may indicate an infection.",
      "I should not ignore the care plan when providing personal care.",
      "Communicating with the service user is important.",
      "Items used during personal care need to be clean."
    ],
    answers: [
      true, false, false, true, true, true, false, true, false, false,
      true, true, true, false, true, false, true, false, false, false
    ]
  },
  {
    id: 20,
    name: "Safeguarding Adults at Risk (Level 1)",
    questions: [
      "Everyone should promote best practice to avoid abuse.",
      "There is a need to respect individual differences.",
      "We all have a duty to protect adults at risk.",
      "There is a need to report concerns we may have about abuse.",
      "An adult at risk may have an acquired brain injury.",
      "Abuse is the violation of an individual's human and civil rights by another.",
      "Sexual abuse is a category of abuse.",
      "Emotional abuse is considered an issue and should be reported.",
      "Neglect is a category of abuse.",
      "Discrimination is classed as abuse.",
      "Abuse can be through repeated acts of poor professional practice.",
      "When being told of abuse you should remain calm.",
      "When being told of abuse you need to listen carefully.",
      "You should regard claims of abuse seriously.",
      "You should not promise to keep secrets when being told of abuse.",
      "It is not acceptable to gossip about abuse cases.",
      "It is not acceptable to destroy evidence regarding abuse claims.",
      "Accurate and detailed reporting is essential with regard to abuse claims.",
      "If you see or hear about abuse you have a duty to report it.",
      "Bruises on the body could be an indicator of abuse."
    ],
    answers: [
      true, false, true, false, true, true, true, false, true, false,
      true, true, false, true, true, false, false, true, false, true
    ]
  },
  {
    id: 21,
    name: "Safeguarding Adults at Risk (Level 2)",
    questions: [
      "We are required to report concerns we may have about abuse.",
      "We all have a duty to protect adults at risk.",
      "A category of abuse could be defined as sexual.",
      "Emotional abuse should be reported.",
      "Neglect is considered a category of abuse.",
      "Written statements about abuse need to be legible.",
      "Ensuring 'best evidence' in cases of abuse is important.",
      "Discrimination is considered a category of abuse.",
      "When being told of abuse you should remain calm.",
      "Abuse can be through repeated acts of poor professional practice.",
      "When being told of abuse you need to listen carefully.",
      "You should regard any claim of abuse seriously.",
      "You should not promise to keep secrets when being told of abuse.",
      "Never gossip about abuse cases with family members.",
      "If you see or hear about abuse you do have a duty to report it.",
      "Bruises on the body could be an indicator of abuse.",
      "It is not acceptable to destroy evidence where abuse is claimed.",
      "Accurate and detailed reporting is essential where abuse is claimed."
    ],
    answers: [
      true, true, true, true, true, true, true, true, true, true,
      true, true, true, true, true, true, true, true
    ]
  },
  {
    id: 22,
    name: "Safeguarding Children (Level 1)",
    questions: [
      "There are dangers for children associated with social media.",
      "When being told of child abuse you should remain calm.",
      "When being told of child abuse you need to listen carefully.",
      "You should regard claims of child abuse seriously.",
      "You should not promise to keep secrets when being told of abuse.",
      "It is not acceptable to gossip about child abuse cases.",
      "It is not acceptable to destroy evidence regarding abuse claims.",
      "Accurate and detailed reporting is essential with regard to abuse claims.",
      "If you see or hear about child abuse you have a duty to report it.",
      "Bruises on the body could be an indicator of child abuse."
    ],
    answers: [
      true, true, false, true, true, false, false, true, false, true
    ]
  },
  {
    id: 23,
    name: "Understanding Your Role & Duty of Care (Level 1)",
    questions: [
      "There are many sources of support for my learning and development.",
      "All healthcare workers should be trained to undertake their role.",
      "Employees need to have a Personal Development Plan.",
      "Employees should be promoting dignity.",
      "Personal development as a healthcare worker is important.",
      "I need to report it if someone is being abused.",
      "You should report colleagues who are abusive or use bad practice.",
      "Team meetings are useful as a source of personal development.",
      "Promoting a service user's independence is important.",
      "There are laws to protect healthcare workers and those they care for."
    ],
    answers: [
      true, true, false, true, true, false, false, true, false, true
    ]
  }
];

async function main() {
  console.log('🌱 Seeding remaining modules (12-23)...\n');
  
  for (const module of modulesData) {
    const formattedQuestions = module.questions.map((text, idx) => ({
      id: `mod${module.id}_q${idx + 1}`,
      text: text,
      options: ["True", "False"],
      correct: module.answers[idx] ? 0 : 1
    }));
    
    await prisma.module.upsert({
      where: { id: module.id },
      update: {
        name: module.name,
        passMark: Math.ceil(module.questions.length * 0.75),
        questions: formattedQuestions
      },
      create: {
        id: module.id,
        name: module.name,
        passMark: Math.ceil(module.questions.length * 0.75),
        questions: formattedQuestions
      }
    });
    
    console.log(`✅ Module ${module.id}: ${module.name} (${module.questions.length} questions) - Pass mark: ${Math.ceil(module.questions.length * 0.75)}/${module.questions.length}`);
  }
  
  console.log(`\n🎉 Seeding complete! Added ${modulesData.length} modules.`);
  console.log(`📊 Total modules now: 23`);
}

main()
  .catch(e => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
