const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const modulesData = [
  // MODULE 1: COSHH Awareness (Level 1)
  {
    id: 1,
    name: "COSHH Awareness (Level 1)",
    passMark: 15,
    questions: [
      { text: "The main H&S legislation is the Health & Safety at Work (etc.) Act 1974.", options: ["True", "False"], correct: 0 },
      { text: "Great care needs to be taken when handling hazardous substances.", options: ["True", "False"], correct: 0 },
      { text: "You do not need to know details about chemicals you handle.", options: ["True", "False"], correct: 1 },
      { text: "There are many ways chemicals and substances can enter the body.", options: ["True", "False"], correct: 0 },
      { text: "Control of Substances Hazardous to Health covers many products.", options: ["True", "False"], correct: 0 },
      { text: "Bleach is not a hazardous substance.", options: ["True", "False"], correct: 1 },
      { text: "You can get contaminated through dust in the air.", options: ["True", "False"], correct: 0 },
      { text: "Blood is not considered a hazardous substance.", options: ["True", "False"], correct: 1 },
      { text: "You need to read the data sheets before using chemicals.", options: ["True", "False"], correct: 0 },
      { text: "Everyday products are always safe to use.", options: ["True", "False"], correct: 1 },
      { text: "Employers do not have to provide training about COSHH.", options: ["True", "False"], correct: 1 },
      { text: "Employees do have to wear protective equipment provided.", options: ["True", "False"], correct: 0 },
      { text: "Even some plants and bulbs are considered as hazardous.", options: ["True", "False"], correct: 0 },
      { text: "A needle stick injury can cause infection.", options: ["True", "False"], correct: 0 },
      { text: "You should report all spills of chemicals, no matter how small.", options: ["True", "False"], correct: 0 },
      { text: "Employers face fines if they do not comply with COSHH Regulations.", options: ["True", "False"], correct: 0 },
      { text: "All COSHH hazards can be seen.", options: ["True", "False"], correct: 1 },
      { text: "Personal Protective Equipment must be worn where required.", options: ["True", "False"], correct: 0 },
      { text: "Home chemicals are always safe to use.", options: ["True", "False"], correct: 1 },
      { text: "I have a duty of care to myself and others with regard to COSHH.", options: ["True", "False"], correct: 0 }
    ]
  },
  // MODULE 2: Dementia Awareness (Level 1)
  {
    id: 2,
    name: "Dementia Awareness (Level 1)",
    passMark: 15,
    questions: [
      { text: "Dementia is an illness, sometimes referred to as brain failure.", options: ["True", "False"], correct: 0 },
      { text: "Dementia can be associated to a person's race, gender or culture.", options: ["True", "False"], correct: 1 },
      { text: "The cause of dementia, as yet, remains unknown.", options: ["True", "False"], correct: 0 },
      { text: "Alzheimer's is not a type of dementia.", options: ["True", "False"], correct: 1 },
      { text: "Huntington's is a type of dementia.", options: ["True", "False"], correct: 0 },
      { text: "Difficulty in expressing thoughts could be a symptom of dementia.", options: ["True", "False"], correct: 0 },
      { text: "There is no cure for Alzheimer's.", options: ["True", "False"], correct: 0 },
      { text: "There is no need to listen carefully to people with dementia.", options: ["True", "False"], correct: 1 },
      { text: "90% of all communication is non-verbal.", options: ["True", "False"], correct: 0 },
      { text: "Loss of memory causes no distress to people suffering dementia.", options: ["True", "False"], correct: 1 },
      { text: "Dementia affects people from all walks of life.", options: ["True", "False"], correct: 0 },
      { text: "A person with dementia may display a variety of symptoms.", options: ["True", "False"], correct: 0 },
      { text: "If a person with dementia shouts at you, then you should shout back.", options: ["True", "False"], correct: 1 },
      { text: "We should support the relationships of a person with dementia.", options: ["True", "False"], correct: 0 },
      { text: "A person with dementia has a life history that is important.", options: ["True", "False"], correct: 0 },
      { text: "There is no need for service user's information to be kept confidential.", options: ["True", "False"], correct: 1 },
      { text: "It is acceptable to patronise people with dementia.", options: ["True", "False"], correct: 1 },
      { text: "A person with dementia may be repetitive in actions and speech.", options: ["True", "False"], correct: 0 },
      { text: "You should take insults from a person with dementia personally.", options: ["True", "False"], correct: 1 },
      { text: "Dementia is not an inevitable consequence of getting older.", options: ["True", "False"], correct: 0 }
    ]
  },
  // MODULE 3: Effective Communication (Level 1)
  {
    id: 3,
    name: "Effective Communication (Level 1)",
    passMark: 15,
    questions: [
      { text: "I should check that an individual's communication aids are working.", options: ["True", "False"], correct: 0 },
      { text: "Providing care does not require any communication skills.", options: ["True", "False"], correct: 1 },
      { text: "There is no need for carers to understand about effective communication.", options: ["True", "False"], correct: 1 },
      { text: "Communication is important in providing care services.", options: ["True", "False"], correct: 0 },
      { text: "There are many things we can do to improve communication.", options: ["True", "False"], correct: 0 },
      { text: "Spoken words are only one type of communication method.", options: ["True", "False"], correct: 0 },
      { text: "Wishes of the individual with regard to communication are not important.", options: ["True", "False"], correct: 1 },
      { text: "Pictures and objects can be used as a means of communicating.", options: ["True", "False"], correct: 0 },
      { text: "It is not important to think about an individual's communication needs.", options: ["True", "False"], correct: 1 },
      { text: "The family may know the best way to communicate with an individual.", options: ["True", "False"], correct: 0 },
      { text: "Communication style should be focused on the individual's wishes.", options: ["True", "False"], correct: 0 },
      { text: "There are legal requirements to protect data about individuals.", options: ["True", "False"], correct: 0 },
      { text: "Professionals can communicate in various ways with those they support.", options: ["True", "False"], correct: 0 },
      { text: "You can ignore the confidentiality wishes of individuals.", options: ["True", "False"], correct: 1 },
      { text: "If I have concerns about information storage I should report them.", options: ["True", "False"], correct: 0 },
      { text: "The range of professionals I could communicate with is very limited.", options: ["True", "False"], correct: 1 },
      { text: "Some individuals will use signing to communicate.", options: ["True", "False"], correct: 0 },
      { text: "The communicating of individual's needs is not important.", options: ["True", "False"], correct: 1 },
      { text: "Communicating with the individual is not important.", options: ["True", "False"], correct: 1 },
      { text: "Communication skills are needed to discuss an individual's care needs.", options: ["True", "False"], correct: 0 }
    ]
  },
  // MODULE 4: End of Life Care (Level 1)
  {
    id: 4,
    name: "End of Life Care (Level 1)",
    passMark: 15,
    questions: [
      { text: "Palliative & End of Life Care concepts have much in common.", options: ["True", "False"], correct: 0 },
      { text: "End of Life Care does not require any special knowledge.", options: ["True", "False"], correct: 1 },
      { text: "There is no need for carers to understand about end of life care.", options: ["True", "False"], correct: 1 },
      { text: "Communication is important in end of life care.", options: ["True", "False"], correct: 0 },
      { text: "Psychological and spiritual concerns are important.", options: ["True", "False"], correct: 0 },
      { text: "Impact on the family is a concern with regard to end of life care.", options: ["True", "False"], correct: 0 },
      { text: "The wishes of the individual with regard to their death are not important.", options: ["True", "False"], correct: 1 },
      { text: "An individual can make changes to their end of life care plan.", options: ["True", "False"], correct: 0 },
      { text: "It is not important to undertake advance care planning.", options: ["True", "False"], correct: 1 },
      { text: "Advance care planning is all about the family's wishes.", options: ["True", "False"], correct: 1 },
      { text: "Advance care planning is focused on the individual's wishes.", options: ["True", "False"], correct: 0 },
      { text: "Carers have an important role to play in end of life care.", options: ["True", "False"], correct: 0 },
      { text: "Professionals need to listen to the end of life care wishes of those they support.", options: ["True", "False"], correct: 0 },
      { text: "You can ignore the wishes of individuals when you disagree with them.", options: ["True", "False"], correct: 1 },
      { text: "If in doubt about an individual's end of life care plan, I should check with my supervisor.", options: ["True", "False"], correct: 0 },
      { text: "The range of professionals who could be involved is very limited.", options: ["True", "False"], correct: 1 },
      { text: "Advance care planning may be instigated by an individual at any time.", options: ["True", "False"], correct: 0 },
      { text: "The recording or communicating wishes of individuals is not important.", options: ["True", "False"], correct: 1 },
      { text: "Communicating with the individual is not important.", options: ["True", "False"], correct: 1 },
      { text: "Adequate knowledge is needed to discuss with an individual their end of life care.", options: ["True", "False"], correct: 0 }
    ]
  },
  // MODULE 5: Epilepsy Awareness (Level 2)
  {
    id: 5,
    name: "Epilepsy Awareness (Level 2)",
    passMark: 15,
    questions: [
      { text: "AEDs are drugs used to treat epilepsy.", options: ["True", "False"], correct: 0 },
      { text: "An epilepsy condition can affect anyone at any time.", options: ["True", "False"], correct: 0 },
      { text: "Brain surgery is not considered an epilepsy treatment.", options: ["True", "False"], correct: 1 },
      { text: "Epilepsy can be triggered by flashing lights or noise.", options: ["True", "False"], correct: 0 },
      { text: "Epilepsy affects around 10,000 people in the UK.", options: ["True", "False"], correct: 1 },
      { text: "Improved knowledge will not help clear up myths about epilepsy.", options: ["True", "False"], correct: 1 },
      { text: "Lack of sleep or tiredness is not a potential epilepsy trigger.", options: ["True", "False"], correct: 1 },
      { text: "AEDs are not drug medication for the treatment of epilepsy.", options: ["True", "False"], correct: 1 },
      { text: "US President Theodore Roosevelt was affected by epilepsy.", options: ["True", "False"], correct: 0 },
      { text: "Highly talented people never have an epilepsy condition.", options: ["True", "False"], correct: 1 },
      { text: "Alcohol or drug use is never an epilepsy trigger.", options: ["True", "False"], correct: 1 },
      { text: "Stress or excitement can be a potential epilepsy trigger.", options: ["True", "False"], correct: 0 },
      { text: "No politicians have ever been affected by epilepsy.", options: ["True", "False"], correct: 1 },
      { text: "A Seizure Diary can help with tracking seizures.", options: ["True", "False"], correct: 0 },
      { text: "Alcohol or drug use can be a seizure trigger.", options: ["True", "False"], correct: 0 },
      { text: "Many fears about epilepsy are due to a lack of knowledge.", options: ["True", "False"], correct: 0 },
      { text: "Well known individuals reportedly have epilepsy conditions.", options: ["True", "False"], correct: 0 },
      { text: "Epilepsy conditions only affect people from a certain walk of life.", options: ["True", "False"], correct: 1 },
      { text: "Epilepsy affects 600,000 people in the UK.", options: ["True", "False"], correct: 0 },
      { text: "There are no safety procedures to follow during an epilepsy seizure.", options: ["True", "False"], correct: 1 }
    ]
  },
  // MODULE 6: Equality & Diversity (Level 1)
  {
    id: 6,
    name: "Equality & Diversity (Level 1)",
    passMark: 15,
    questions: [
      { text: "All care providers need to be aware and comply with the requirements of the Equality Act 2010.", options: ["True", "False"], correct: 0 },
      { text: "It is wrong to discriminate against a person because of their race.", options: ["True", "False"], correct: 0 },
      { text: "It is sensible for an employer to have Equality & Diversity Policy and procedures in place.", options: ["True", "False"], correct: 0 },
      { text: "The Equality Act 2010 does not pull together various anti-discrimination laws in Great Britain.", options: ["True", "False"], correct: 1 },
      { text: "The Equality Act 2010 protects very few people against discrimination.", options: ["True", "False"], correct: 1 },
      { text: "White people are not protected by the Equality Act 2010.", options: ["True", "False"], correct: 1 },
      { text: "True equality means treating everyone differently in order to treat them the same.", options: ["True", "False"], correct: 0 },
      { text: "Unwanted sexual advances would not be seen as harassment.", options: ["True", "False"], correct: 1 },
      { text: "Setting unattainable targets at work would not be seen as harassment.", options: ["True", "False"], correct: 1 },
      { text: "Bullying and harassment are regarded as equality and diversity issues.", options: ["True", "False"], correct: 0 },
      { text: "It is unlawful to select someone solely on the grounds of their race, ethnicity, gender or disability.", options: ["True", "False"], correct: 0 },
      { text: "True equality and diversity means treating everyone equally on their merits.", options: ["True", "False"], correct: 0 },
      { text: "Harassment can be persistent or an isolated incident towards one or more people.", options: ["True", "False"], correct: 0 },
      { text: "There is no need for an employer to have fair and lawful recruitment and selection practices.", options: ["True", "False"], correct: 1 },
      { text: "The Equality Act 2010 is mainly focused on one particular group in the community.", options: ["True", "False"], correct: 1 },
      { text: "Employers do not have to take action if their employee is harassed by a resident's family member.", options: ["True", "False"], correct: 1 },
      { text: "The Equality Act 2010 limits the use of health questions prior to a job being offered.", options: ["True", "False"], correct: 0 },
      { text: "Terms in a contract of employment that require pay secrecy are unenforceable.", options: ["True", "False"], correct: 0 },
      { text: "A person's colour, ethnic or national origins or social background must not affect the choice of an individual for a particular job.", options: ["True", "False"], correct: 0 },
      { text: "All employers should review their existing recruitment, selection, promotion and training procedures to ensure they are fair to all and support equality and diversity.", options: ["True", "False"], correct: 0 }
    ]
  },
  // MODULE 7: Fire Safety (Level 1)
  {
    id: 7,
    name: "Fire Safety (Level 1)",
    passMark: 15,
    questions: [
      { text: "Fire alarms should be tested on a weekly basis.", options: ["True", "False"], correct: 0 },
      { text: "A blocked fire exit would not be considered a major hazard.", options: ["True", "False"], correct: 1 },
      { text: "Water extinguishers can be used on electrical fires.", options: ["True", "False"], correct: 1 },
      { text: "You should not fight fires in confined spaces.", options: ["True", "False"], correct: 0 },
      { text: "The three sides of the triangle of fire are heat, oxygen and smoke.", options: ["True", "False"], correct: 1 },
      { text: "Only fight a fire if it is safe to do so and you are trained.", options: ["True", "False"], correct: 0 },
      { text: "Smoke detectors at home do not save lives.", options: ["True", "False"], correct: 1 },
      { text: "It is advisable to have an evacuation plan for your own home.", options: ["True", "False"], correct: 0 },
      { text: "It is safe to ignore a fire alarm if you can't see a fire.", options: ["True", "False"], correct: 1 },
      { text: "Carbon Dioxide extinguishers are suitable for electrical fires.", options: ["True", "False"], correct: 0 },
      { text: "Fire evacuation drills in the workplace can save lives.", options: ["True", "False"], correct: 0 },
      { text: "Poorly stored flammable liquids can cause fires.", options: ["True", "False"], correct: 0 },
      { text: "Fire exits should be kept clear of rubbish.", options: ["True", "False"], correct: 0 },
      { text: "Fires can be spread by conduction.", options: ["True", "False"], correct: 0 },
      { text: "There is no need to report a faulty extinguisher.", options: ["True", "False"], correct: 1 },
      { text: "Fire alarm call points do not need to be kept clear at all times.", options: ["True", "False"], correct: 1 },
      { text: "There is no need to test your smoke detectors regularly.", options: ["True", "False"], correct: 1 },
      { text: "Everyone at work should be trained on fire evacuation procedures.", options: ["True", "False"], correct: 0 },
      { text: "Smoking in unauthorised areas can lead to fire situations.", options: ["True", "False"], correct: 0 },
      { text: "You should always ensure that you do not block fire escape routes.", options: ["True", "False"], correct: 0 }
    ]
  },
  // MODULE 8: First Aid Basic Life Support (Level 1)
  {
    id: 8,
    name: "First Aid Basic Life Support (Level 1)",
    passMark: 15,
    questions: [
      { text: "First Aid is the care given to a casualty before professional help arrives.", options: ["True", "False"], correct: 0 },
      { text: "You need lots of training to provide first aid.", options: ["True", "False"], correct: 1 },
      { text: "You do not need lots of expensive equipment to do first aid.", options: ["True", "False"], correct: 0 },
      { text: "You should put butter or cream on a burn.", options: ["True", "False"], correct: 1 },
      { text: "You should assess the scene for danger before undertaking first aid.", options: ["True", "False"], correct: 0 },
      { text: "A breathing, unconscious, casualty should be placed in the recovery position.", options: ["True", "False"], correct: 0 },
      { text: "A casualty who has been electrocuted may have suffered burns.", options: ["True", "False"], correct: 0 },
      { text: "You can remove a piece of metal that is stuck in a casualty's eye.", options: ["True", "False"], correct: 1 },
      { text: "Encourage a casualty who is choking to cough hard.", options: ["True", "False"], correct: 0 },
      { text: "A person suffering a heart attack should be encouraged to stand up.", options: ["True", "False"], correct: 1 },
      { text: "You should not move a casualty if you suspect a spinal injury.", options: ["True", "False"], correct: 0 },
      { text: "You need to record all injuries at work.", options: ["True", "False"], correct: 0 },
      { text: "You need to cool a burn with water for only 2 minutes.", options: ["True", "False"], correct: 1 },
      { text: "One heart attack symptom may be a severe pain high in the abdomen.", options: ["True", "False"], correct: 0 },
      { text: "With blood loss the priority is to stop the bleeding.", options: ["True", "False"], correct: 0 },
      { text: "There is no need to worry about keeping the airway clear.", options: ["True", "False"], correct: 1 },
      { text: "Your own safety is not important when in a first aid situation.", options: ["True", "False"], correct: 1 },
      { text: "You should cool a burn for a minimum of 20 minutes with water.", options: ["True", "False"], correct: 0 },
      { text: "Cold, clammy, pale grey skin is not a sign of shock.", options: ["True", "False"], correct: 1 },
      { text: "You need to phone 999 on every occasion you perform first aid.", options: ["True", "False"], correct: 1 }
    ]
  },
  // MODULE 9: Food Hygiene (Level 1)
  {
    id: 9,
    name: "Food Hygiene (Level 1)",
    passMark: 15,
    questions: [
      { text: "You should wash your hands after handling raw meat.", options: ["True", "False"], correct: 0 },
      { text: "Pests do not spread diseases.", options: ["True", "False"], correct: 1 },
      { text: "A dog or cat in the kitchen can cause food contamination.", options: ["True", "False"], correct: 0 },
      { text: "All food bacteria are harmful.", options: ["True", "False"], correct: 1 },
      { text: "A clean kitchen will help keep food pests away.", options: ["True", "False"], correct: 0 },
      { text: "Raw meat can safely be stored next to cooked meat.", options: ["True", "False"], correct: 1 },
      { text: "You need to take special precautions with barbecue meals.", options: ["True", "False"], correct: 0 },
      { text: "Smoking over food can cause food contamination.", options: ["True", "False"], correct: 0 },
      { text: "An open tin of food can be safely stored in the refrigerator.", options: ["True", "False"], correct: 1 },
      { text: "Food handlers should wash their hands often.", options: ["True", "False"], correct: 0 },
      { text: "Food poisoning puts elderly people particularly at risk.", options: ["True", "False"], correct: 0 },
      { text: "Bacteria are most likely to grow in the temperature range 5°C to 63°C.", options: ["True", "False"], correct: 0 },
      { text: "Physical contamination takes place only during the packaging process.", options: ["True", "False"], correct: 1 },
      { text: "A food handler who has food poisoning should not be preparing food.", options: ["True", "False"], correct: 0 },
      { text: "You should wash your hands to reduce bacteria.", options: ["True", "False"], correct: 0 },
      { text: "Cuts should be covered with a waterproof dressing.", options: ["True", "False"], correct: 0 },
      { text: "Hair can contaminate food that is being prepared.", options: ["True", "False"], correct: 0 },
      { text: "Jewellery can carry bacteria.", options: ["True", "False"], correct: 0 },
      { text: "You do not need to wash your hands after handling raw meat.", options: ["True", "False"], correct: 1 },
      { text: "Diarrhoea is not a symptom of food poisoning.", options: ["True", "False"], correct: 1 }
    ]
  },
  // MODULE 10: Food Hygiene (Level 2)
  {
    id: 10,
    name: "Food Hygiene (Level 2)",
    passMark: 15,
    questions: [
      { text: "Which of the following is food legislation?", options: ["Health & Safety at Work (Etc.) Act.", "Food Safety Act.", "Food Hygiene Law."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["Rapid population growth is not a factor for the high increase in food poisoning cases.", "Rapid population growth is a factor for the high increase in food poisoning cases.", "Good hygienic practices will not protect people from food poisoning."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["Washing your hands with soap and water will remove transient microorganisms.", "There is no need for employers to assess food hygiene risks in the workplace.", "Washing your hands with water will kill microorganisms."], correct: 0 },
      { text: "Which of these statements is correct?", options: ["Employees only need to wash their hands for approximately 5 seconds.", "Not all food bacteria are harmful.", "Animals in the kitchen will not cause food contamination."], correct: 1 },
      { text: "Which of these instructions would you follow?", options: ["You should wash your hands properly to prevent food poisoning.", "No need to take care; you can safely mix raw and cooked food.", "The fridge is full, just thaw the meat by the oven."], correct: 0 },
      { text: "Which of these statements is correct?", options: ["An open tin of fruit can safely be stored in the fridge.", "Never store cooked meat next to raw meat.", "Smoking over food it will not cause food contamination."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["Gloves should always be worn when kitchen cleaning with chemicals.", "Children are not at risk from food poisoning.", "There is no need to take precautions with barbecue meals."], correct: 0 },
      { text: "Which of these instructions would you follow?", options: ["Always use different boards for cooked and raw food.", "Don't put a waterproof dressing on a cut that small.", "Cut down on the time you take to wash your hands, 10 seconds will do."], correct: 0 },
      { text: "Which of these statements is correct?", options: ["Bacteria are most likely to grow in the temperature range 5°C to 63°C.", "The danger zone for best bacteria growth is 1°C to 4°C.", "A food handler with diarrhoea can safely prepare food."], correct: 0 },
      { text: "Which of these statements is correct?", options: ["Only my employer is responsible for food poisoning prevention.", "There is no need for food hygiene risk assessments at work.", "Risk assessments should be in place in the kitchen."], correct: 2 },
      { text: "Which of these statements is correct?", options: ["The danger zone is -18° in a freezer.", "The danger zone is 64-72° in hot holding.", "The danger zone is 5-63° in a room temperature of 25°."], correct: 2 },
      { text: "Which of these statements is correct?", options: ["Ideal hot holding is at 5-18°.", "Ideal hot holding is 64-72°.", "Ideal hot holding is 5-63°."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["Ideal freezer temperature is at -18°.", "Ideal freezer temperature is at -2°.", "Ideal freezer temperature is at -5°."], correct: 0 },
      { text: "Which of these statements is correct?", options: ["Ideal fridge temperature is at 5-10°.", "Ideal fridge temperature is at 1-2°.", "Ideal fridge temperature is at 1-5°."], correct: 2 },
      { text: "Which of these statements is correct?", options: ["Insect Repellant being sprayed over food would be classed as a chemical contaminant.", "Salmonella can be classed as a chemical contaminant.", "A screw found in food can be classed as a chemical contaminant."], correct: 0 },
      { text: "Which of these statements is correct?", options: ["A screw found in food can be classed as a physical contaminant.", "Bleach coming into contact with food can be classed as a physical contaminant.", "Salmonella can be classed as a physical contaminant."], correct: 0 },
      { text: "Which of these statements is correct?", options: ["Insect Spray can be classed as a bacterial contaminant.", "A screw found in food can be classed as a bacterial contaminant.", "Staphylococcus can be classed as a bacterial contaminant."], correct: 2 },
      { text: "Which of these statements is correct?", options: ["Pest control is vitally important with regard to food hygiene.", "Risk Assessments are not required with regard to food hygiene.", "Pest control is very low priority with regard to food hygiene."], correct: 0 },
      { text: "Which of these statements is correct?", options: ["A dog or cat in the kitchen environment is not hygienic.", "Hand washing is only required when you arrive and leave at work.", "Animals in the kitchen environment have no impact on food hygiene."], correct: 0 },
      { text: "Which of these statements is correct?", options: ["There is no need for a cleaning schedule in the kitchen.", "Cleaning in the kitchen only needs to be done once a week.", "A cleaning schedule should be in place in the kitchen and followed."], correct: 2 }
    ]
  },
  // MODULE 11: Health & Safety (Level 1)
  {
    id: 11,
    name: "Health & Safety (Level 1)",
    passMark: 15,
    questions: [
      { text: "The main H&S legislation is the Health & Safety at Work (etc.) Act 1974.", options: ["True", "False"], correct: 0 },
      { text: "Great care needs to be taken when handling hazardous substances.", options: ["True", "False"], correct: 0 },
      { text: "Display Screen Equipment at work normally needs to be assessed.", options: ["True", "False"], correct: 0 },
      { text: "It is not necessary to record violent incidents at work.", options: ["True", "False"], correct: 1 },
      { text: "Water extinguishers are best for electrical fires.", options: ["True", "False"], correct: 1 },
      { text: "Fire alarms should be tested weekly.", options: ["True", "False"], correct: 0 },
      { text: "Poor posture can cause back injuries.", options: ["True", "False"], correct: 0 },
      { text: "Electrical items at work should be tested.", options: ["True", "False"], correct: 0 },
      { text: "A faulty hoist would not be considered a major hazard.", options: ["True", "False"], correct: 1 },
      { text: "Hazards can cause infections.", options: ["True", "False"], correct: 0 },
      { text: "Employers do not have to provide training.", options: ["True", "False"], correct: 1 },
      { text: "Employees do have to wear protective equipment provided.", options: ["True", "False"], correct: 0 },
      { text: "It is safe to be under the influence of alcohol and undertake work.", options: ["True", "False"], correct: 1 },
      { text: "Using a fire extinguisher in confined spaces can be dangerous.", options: ["True", "False"], correct: 0 },
      { text: "There is no need to report near misses at work.", options: ["True", "False"], correct: 1 },
      { text: "500,000+ manual handling injuries are reported to the HSE each year.", options: ["True", "False"], correct: 0 },
      { text: "All hazards can be seen and heard.", options: ["True", "False"], correct: 1 },
      { text: "All accidents at work should be reported.", options: ["True", "False"], correct: 0 },
      { text: "A hazard is anything with the potential to cause harm.", options: ["True", "False"], correct: 0 },
      { text: "I have a duty of care to myself and others.", options: ["True", "False"], correct: 0 }
    ]
  },
  // MODULE 12: Infection Control (Level 2)
  {
    id: 12,
    name: "Infection Control (Level 2)",
    passMark: 15,
    questions: [
      { text: "Which of these statements is correct?", options: ["Rapid population growth is a factor for the high increase in disease cases.", "Rapid population growth is not a factor for high increase in disease cases.", "Population growth has no impact in the increase of disease cases."], correct: 0 },
      { text: "Which of these statements is correct?", options: ["Employees are not at risk of infection when they dispose of medical waste.", "Employees are at risk of infection when they dispose of medical waste.", "Clients are not at risk of infection during disposal of medical waste."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["Good infection prevention practices protect only clients.", "Good infection prevention practices protect only employees.", "Good infection prevention practices protect everyone."], correct: 2 },
      { text: "Which of these statements is correct?", options: ["HIV and hepatitis B infections can be cured.", "HIV and hepatitis B infections cannot be cured.", "There is a cure for HIV and hepatitis B infections."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["Correct routine hand washing will not remove transient microorganisms.", "Correct routine hand washing removes transient microorganisms.", "Handwashing does not remove transient microorganisms."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["Handwashing will not reduce the spread of infection in healthcare settings.", "Handwashing is not an infection control measure in healthcare settings.", "Handwashing will reduce the spread of infection in healthcare settings."], correct: 2 },
      { text: "Which of these statements is correct?", options: ["There are eight links in the chain of infection.", "There are six links in the chain of infection.", "There are five links in the chain of infection."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["Disinfection is not one of the levels of decontamination.", "Cleaning is not one of the levels of decontamination.", "Sterilisation is one of the levels of decontamination."], correct: 2 },
      { text: "Which of these statements is correct?", options: ["It is safe and legal for you to reuse disposable gloves.", "A separate pair of gloves must be used for each client.", "You can use the same pair of gloves for all the clients."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["Housekeeping has no impact on microorganisms at work.", "Housekeeping will reduce the number of microorganisms at work.", "Housekeeping will not reduce the number of microorganisms at work."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["Everyone who handles medical waste is at risk of infections and injury.", "Plain water will rapidly kill or inactivate infectious microorganisms.", "The main purpose of 'housekeeping' is to keep the premises dust-free."], correct: 0 },
      { text: "Which of these statements is correct?", options: ["When cleaning up spills of bodily fluids gloves do not need to be worn.", "When cleaning up spills of bodily fluids gloves should always be worn.", "Cleaning up spills of bodily fluids does not require gloves to be worn."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["There is not a need for Infection Control Risk Assessments.", "The Infection Control Risk Assessments are not important.", "There is a need for Infection Control Risk Assessments."], correct: 2 },
      { text: "Which of these statements is correct?", options: ["Breaking a hypodermic needle before disposal is acceptable.", "Breaking a hypodermic needle before disposal is not acceptable.", "Breaking a hypodermic needle before disposal is good practice."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["Carrying unprotected sharps around the premises is a risk.", "Carrying unprotected sharps around the premises is acceptable.", "Carrying unprotected sharps around the premises is not a risk."], correct: 0 },
      { text: "Which of these statements is correct?", options: ["Infection Control is only important to housekeeping employees.", "Infection control is only important to managers.", "All employees have a role with regards to infection control."], correct: 2 },
      { text: "Which of these statements is correct?", options: ["Only those involved in care need to receive infection control training.", "All employees should receive infection control training.", "Only managers need to receive infection control training."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["There is no need to report notifiable diseases.", "The law states that notifiable diseases must be reported.", "Notifiable diseases do not need to be reported."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["Proper disposal of medical waste does not help control infections.", "Proper disposal of medical waste does not help the spreading of infections.", "Proper disposal of medical waste minimises the spread of infections."], correct: 2 },
      { text: "Which of these statements is correct?", options: ["Sharps containers should be packed to the top to save money.", "Disposal of sharps must be in accordance with safety guidance.", "You can ignore the instructions for the safe disposal of sharps."], correct: 1 }
    ]
  },
  // MODULE 13: Medication Awareness (Level 1)
  {
    id: 13,
    name: "Medication Awareness (Level 1)",
    passMark: 15,
    questions: [
      { text: "I need to be aware of the Medicine Act 1968.", options: ["True", "False"], correct: 0 },
      { text: "I do not need to be concerned about the Misuse of Drugs Act.", options: ["True", "False"], correct: 1 },
      { text: "Some people take medication to enable them to live their lives.", options: ["True", "False"], correct: 0 },
      { text: "Medication has no impact on preventing disease.", options: ["True", "False"], correct: 1 },
      { text: "Medication is sometimes taken to ensure normal body functions.", options: ["True", "False"], correct: 0 },
      { text: "Tablets are a form of medication that is taken.", options: ["True", "False"], correct: 0 },
      { text: "Drops, sprays and ointments are considered medication.", options: ["True", "False"], correct: 0 },
      { text: "I do not need to be aware of the contents of a MAR sheet.", options: ["True", "False"], correct: 1 },
      { text: "I should be observing for signs of side effects and other symptoms.", options: ["True", "False"], correct: 0 },
      { text: "An anaphylaxis reaction cannot kill someone.", options: ["True", "False"], correct: 1 },
      { text: "Anaphylaxis describes a serious allergic reaction.", options: ["True", "False"], correct: 0 },
      { text: "Anaphylaxis can lead to a cardiac arrest.", options: ["True", "False"], correct: 0 },
      { text: "There is no need to ensure you give the right dose of medication.", options: ["True", "False"], correct: 1 },
      { text: "If you make a mistake with medication you must report it immediately.", options: ["True", "False"], correct: 0 },
      { text: "You should ensure medication is taken at the right time.", options: ["True", "False"], correct: 0 },
      { text: "There is no need to sign the MAR sheet.", options: ["True", "False"], correct: 1 },
      { text: "There is no need to check for known allergies.", options: ["True", "False"], correct: 1 },
      { text: "Accurate and detailed recording is important with regard to medication.", options: ["True", "False"], correct: 0 },
      { text: "There is no need to check the expiry date of medication.", options: ["True", "False"], correct: 1 },
      { text: "You should always read the label on medication.", options: ["True", "False"], correct: 0 }
    ]
  },
  // MODULE 14: Medication Awareness (Level 2)
  {
    id: 14,
    name: "Medication Awareness (Level 2)",
    passMark: 15,
    questions: [
      { text: "Which of these statements is correct?", options: ["I do not need to be concerned about the Misuse of Drugs Act.", "I need to be aware of the Medicine Act 1968.", "There is no need to check the expiry date of medication."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["I do not need to be aware of medication legislation.", "Some people take medication to enable them to live their lives.", "Medication has no impact on preventing disease."], correct: 1 },
      { text: "Which of the following is medication legislation?", options: ["Misuse of Drugs Act.", "Dangerous Drug Law.", "Health & Safety at Work Law."], correct: 0 },
      { text: "Which of these statements is correct?", options: ["I do not need to be aware of the contents of a MAR sheet.", "I should be observing for side effects and other symptoms.", "An anaphylaxis reaction cannot kill someone."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["There is no need to sign the MAR sheet.", "There is no need to check for known allergies.", "Accurate and detailed recording is important regarding medication."], correct: 2 },
      { text: "Which of these statements is correct?", options: ["Drops, sprays and ointments are considered medication.", "I do not need to be aware of the contents of a MAR sheet.", "Drops, sprays and ointments are not considered medication."], correct: 0 },
      { text: "Which of these statements is correct?", options: ["If you make a mistake with medication you must report it immediately.", "If you make a mistake with medication never report it.", "There is no need to ensure you give the right dose of medication."], correct: 0 },
      { text: "Which of these instructions would you follow?", options: ["No need to take care; there is no danger when handling medicine.", "Be aware that Anaphylaxis can lead to a cardiac arrest.", "It is only a small overdose and it is not life threatening, no need to report it."], correct: 1 },
      { text: "Which of these instructions would you follow?", options: ["It is not on the MAR sheet, but he can have the pill anyway.", "Correctly complete the MAR sheet.", "The pills are mixed up, give them anyway."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["If in doubt about medication administration get your employer's advice.", "You can mix aspirin with other medicines; it is quite safe.", "She needs to get rest so we can double her sleeping pills tonight."], correct: 0 },
      { text: "Which of these statements is correct?", options: ["There is no need for medication to be taken at the right time.", "You do not need to monitor if the service user takes their medication.", "Always take care; there is always danger when handling medicine."], correct: 2 },
      { text: "Which of these statements is correct?", options: ["Ensure the correct medication is given to the right service user.", "Completing the MAR sheet is not that important.", "There is no need to report any adverse reactions to medication."], correct: 0 },
      { text: "Which of these statements is correct?", options: ["Only my employer is responsible for medication administration.", "There is no need to read the label on medication.", "There is a need to check the expiry date of medication."], correct: 2 },
      { text: "Which of these statements is correct?", options: ["Employees who administer medication should be competent.", "Employees who administer medication do not need to be competent.", "There is no need for medication administration competency checks."], correct: 0 },
      { text: "Which of these statements is correct?", options: ["I do not need to be aware of my employer's medication policy.", "I must read and understand my employer's medication policy.", "Only senior staff need to follow my employer's medication policy."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["I do not need to follow medication procedures of my employer.", "I must follow the medication procedures of my employer.", "I can ignore the medication procedures of my employer."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["Employees should know the 7 Rights of Medication Administration.", "There is no need to follow the 7 Rights of Medication Administration.", "Those administering medication do not need to demonstrate knowledge."], correct: 0 },
      { text: "Which of these statements is correct?", options: ["Never administer medications that are not labelled or unmarked.", "You can administer medications that are not labelled or unmarked.", "If a family member tells you to give a medication to a client, you can."], correct: 0 },
      { text: "Which of these statements is correct?", options: ["MAR sheet should only be signed for some medications administered.", "MAR sheet should be signed for each medication administered.", "MAR sheet completion can be ignored if you are busy."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["Formal Medication Audits must be undertaken by the organisation.", "Medication Audits are just a waste of time and do not help prevent drug errors.", "Medication Audits will not help identify administration problems."], correct: 0 }
    ]
  },
  // MODULE 15: Mental Capacity Act & DOLS (Level 1)
  {
    id: 15,
    name: "Mental Capacity Act & DOLS (Level 1)",
    passMark: 15,
    questions: [
      { text: "All care providers need to be aware and comply with the requirements of the Mental Capacity Act.", options: ["True", "False"], correct: 0 },
      { text: "The use of restraint must always be in line with best practice.", options: ["True", "False"], correct: 0 },
      { text: "The Deprivation of Liberty Safeguards was introduced as an amendment to the Mental Capacity Act 2005.", options: ["True", "False"], correct: 0 },
      { text: "It is alright to presume that a person lacks capacity if they are of a certain age and have dementia.", options: ["True", "False"], correct: 1 },
      { text: "If a person makes really unwise decisions, that is evidence that the person lacks capacity.", options: ["True", "False"], correct: 1 },
      { text: "If a person cannot make a decision without help, they lack capacity.", options: ["True", "False"], correct: 1 },
      { text: "Capacity assessments must be reviewed for each new decision.", options: ["True", "False"], correct: 0 },
      { text: "Capacity assessments only need to be reviewed annually.", options: ["True", "False"], correct: 1 },
      { text: "A decision to deprive someone of their liberty cannot be challenged.", options: ["True", "False"], correct: 1 },
      { text: "Every effort should be made to encourage and enable the person who lacks capacity to take part in making the decision.", options: ["True", "False"], correct: 0 },
      { text: "Someone's best interests can be based simply on age, appearance, condition or behaviour.", options: ["True", "False"], correct: 1 },
      { text: "Under the Mental Capacity Act any decision or act must be in a person's best interests.", options: ["True", "False"], correct: 0 },
      { text: "Capacity assessments can be recorded in a person's care plan without a special form.", options: ["True", "False"], correct: 0 },
      { text: "If you suspect that a person lacks capacity, but they are in agreement with your decision you will not need to assess their capacity.", options: ["True", "False"], correct: 1 },
      { text: "Best Interest Decisions must always be made in a multi-disciplinary group meeting.", options: ["True", "False"], correct: 0 },
      { text: "The person who chairs a best interest meeting will always be the decision maker.", options: ["True", "False"], correct: 1 },
      { text: "A record of a best interest decision must include consideration of the best interest checklist.", options: ["True", "False"], correct: 0 },
      { text: "It is good practice for professionals to carry out a proper assessment of a person's capacity to make particular decisions.", options: ["True", "False"], correct: 0 },
      { text: "A person without mental capacity can be physically restrained under section 5 of the Act.", options: ["True", "False"], correct: 0 },
      { text: "Any decision to deprive an individual of their liberty can be challenged.", options: ["True", "False"], correct: 0 }
    ]
  },
  // MODULE 16: Nutrition & Fluids (Level 1)
  {
    id: 16,
    name: "Nutrition & Fluids (Level 1)",
    passMark: 15,
    questions: [
      { text: "All service users should be assessed with regard to nutrition needs.", options: ["True", "False"], correct: 0 },
      { text: "Nutrition assessment does not require any special knowledge.", options: ["True", "False"], correct: 1 },
      { text: "There is no need for carers to understand about nutrition.", options: ["True", "False"], correct: 1 },
      { text: "We should monitor the fluid intake of those we care for.", options: ["True", "False"], correct: 0 },
      { text: "Fluid intake of service users is important.", options: ["True", "False"], correct: 0 },
      { text: "A good balanced diet is important for those we care for.", options: ["True", "False"], correct: 0 },
      { text: "There is no need to report it if you feel an individual is dehydrating.", options: ["True", "False"], correct: 1 },
      { text: "Fluids should be available for those we care for throughout the day.", options: ["True", "False"], correct: 0 },
      { text: "It is not important to offer appetising food.", options: ["True", "False"], correct: 1 },
      { text: "There is no need to give choices of food to those we care for.", options: ["True", "False"], correct: 1 },
      { text: "We should ensure we provide nutritious food for those we care for.", options: ["True", "False"], correct: 0 },
      { text: "Carers have an important role to play in ensuring those they care for get nutritious food.", options: ["True", "False"], correct: 0 },
      { text: "Carers need to listen to the nutritional and fluid wishes of those they support.", options: ["True", "False"], correct: 0 },
      { text: "You can ignore the requests of individuals for fluids if you feel they do not need them.", options: ["True", "False"], correct: 1 },
      { text: "If in doubt about nutritional and fluid needs of an individual, I should check with my supervisor.", options: ["True", "False"], correct: 0 },
      { text: "There is no need to provide a choice of food for those we care for.", options: ["True", "False"], correct: 1 },
      { text: "On occasions, it may be necessary to record an individual's food and fluid intake.", options: ["True", "False"], correct: 0 },
      { text: "There is no need to take account of food allergies individuals may have.", options: ["True", "False"], correct: 1 },
      { text: "Communicating with the individual over their food and drink needs is not important.", options: ["True", "False"], correct: 1 },
      { text: "Those who prepare food for individuals being cared for should understand about the nutritional value of different foods.", options: ["True", "False"], correct: 0 }
    ]
  },
  // MODULE 17: People Movers Moving & Handling (Level 1)
  {
    id: 17,
    name: "People Movers Moving & Handling (Level 1)",
    passMark: 15,
    questions: [
      { text: "The main safety legislation is the Health & Safety at Work (etc.) Act 1974.", options: ["True", "False"], correct: 0 },
      { text: "I do not need to do a personal risk assessment before moving a person.", options: ["True", "False"], correct: 1 },
      { text: "I should always follow best practice and not use lifts like the 'Drag Lift'.", options: ["True", "False"], correct: 0 },
      { text: "The drag lift can be used when requested by the service user.", options: ["True", "False"], correct: 1 },
      { text: "I must obey reasonable and lawful instructions.", options: ["True", "False"], correct: 0 },
      { text: "I must report moving and handling concerns to the appropriate person.", options: ["True", "False"], correct: 0 },
      { text: "Twisting and stooping can cause back injuries.", options: ["True", "False"], correct: 0 },
      { text: "It is acceptable to use the Australian lift.", options: ["True", "False"], correct: 1 },
      { text: "The discs in between each vertebra act as a cushion.", options: ["True", "False"], correct: 0 },
      { text: "The back muscles are the main ones used during manual handling.", options: ["True", "False"], correct: 1 },
      { text: "Correct clothing and footwear should be worn when manual handling.", options: ["True", "False"], correct: 0 },
      { text: "Communication is important when moving an unconscious service user.", options: ["True", "False"], correct: 0 },
      { text: "There is no need to read the risk assessment before moving a person.", options: ["True", "False"], correct: 1 },
      { text: "The main muscles used during manual handling are the thigh muscles.", options: ["True", "False"], correct: 0 },
      { text: "You should always roll the service user towards you.", options: ["True", "False"], correct: 0 },
      { text: "You can lift a service user if they refuse to use the hoist.", options: ["True", "False"], correct: 1 },
      { text: "Only the service user will get injured if I make a moving & handling error.", options: ["True", "False"], correct: 1 },
      { text: "I should report all moving and handling problems to my employer.", options: ["True", "False"], correct: 0 },
      { text: "Manual Handling accidents only happen in the workplace.", options: ["True", "False"], correct: 1 },
      { text: "Everyone who moves loads is at risk of injury.", options: ["True", "False"], correct: 0 }
    ]
  },
  // MODULE 18: Person Centred Care (Level 1)
  {
    id: 18,
    name: "Person Centred Care (Level 1)",
    passMark: 15,
    questions: [
      { text: "Person Centred Care needs an integrated approach.", options: ["True", "False"], correct: 0 },
      { text: "Person Centred Care does not include awareness of life history.", options: ["True", "False"], correct: 1 },
      { text: "Plans can be developed to ensure Person Centred Care.", options: ["True", "False"], correct: 0 },
      { text: "Person Centred Care does not mean engaging fully with individuals.", options: ["True", "False"], correct: 1 },
      { text: "Person Centred Care means being respectful and valuing diversity.", options: ["True", "False"], correct: 0 },
      { text: "Person Centred Care is about promoting dignity and supporting.", options: ["True", "False"], correct: 0 },
      { text: "Person Centred Care is about giving people real choice in how they live.", options: ["True", "False"], correct: 0 },
      { text: "Person Centred Care is all about the choices of the carer coming first.", options: ["True", "False"], correct: 1 },
      { text: "Maintaining a service user's privacy and dignity are important.", options: ["True", "False"], correct: 0 },
      { text: "Life history is just a list of people they know.", options: ["True", "False"], correct: 1 },
      { text: "Management should be focused on providing Person Centred Care.", options: ["True", "False"], correct: 0 },
      { text: "All employees should be trained to provide Person Centred Care.", options: ["True", "False"], correct: 0 },
      { text: "Employees do not need to promote meaningful activities.", options: ["True", "False"], correct: 1 },
      { text: "Employees should be promoting dignity.", options: ["True", "False"], correct: 0 },
      { text: "Understanding a person's life history builds relationships.", options: ["True", "False"], correct: 0 },
      { text: "There is no need for service user's information to be kept confidential.", options: ["True", "False"], correct: 1 },
      { text: "A service user must conform to the will of the organisation of the home.", options: ["True", "False"], correct: 1 },
      { text: "Team meetings are useful to review Person Centred Care.", options: ["True", "False"], correct: 0 },
      { text: "Helping a service user to engage in activities is not important.", options: ["True", "False"], correct: 1 },
      { text: "Person Centred Planning needs to be reviewed regularly.", options: ["True", "False"], correct: 0 }
    ]
  },
  // MODULE 19: Personal & Pressure Care (Level 1)
  {
    id: 19,
    name: "Personal & Pressure Care (Level 1)",
    passMark: 15,
    questions: [
      { text: "A person receiving personal care may feel embarrassed.", options: ["True", "False"], correct: 0 },
      { text: "Personal care does not require any special knowledge.", options: ["True", "False"], correct: 1 },
      { text: "There is no need for carers to monitor sores and dressings.", options: ["True", "False"], correct: 1 },
      { text: "Pressure sores are graded by classification.", options: ["True", "False"], correct: 0 },
      { text: "The dignity of a person is important when assisting with personal care.", options: ["True", "False"], correct: 0 },
      { text: "You should be guided by the service user and the care plan.", options: ["True", "False"], correct: 0 },
      { text: "The feelings of the service user are not important.", options: ["True", "False"], correct: 1 },
      { text: "Personal care includes ensuring personal hygiene.", options: ["True", "False"], correct: 0 },
      { text: "There are eight grades of pressure ulcer / sore classification.", options: ["True", "False"], correct: 1 },
      { text: "When changing pads there is no need to wear gloves.", options: ["True", "False"], correct: 1 },
      { text: "Always prepare the environment before performing personal care.", options: ["True", "False"], correct: 0 },
      { text: "Always communicate with the service user to establish their wishes.", options: ["True", "False"], correct: 0 },
      { text: "Always wash your hands before and after assisting with care.", options: ["True", "False"], correct: 0 },
      { text: "You can dispose of soiled items in any way you like.", options: ["True", "False"], correct: 1 },
      { text: "If in doubt about personal care I should check with my supervisor.", options: ["True", "False"], correct: 0 },
      { text: "The range of personal care requirements is very limited.", options: ["True", "False"], correct: 1 },
      { text: "Smell from a dressing may indicate an infection.", options: ["True", "False"], correct: 0 },
      { text: "I can ignore the care plan when providing personal care.", options: ["True", "False"], correct: 1 },
      { text: "Communicating with the service user is not important.", options: ["True", "False"], correct: 1 },
      { text: "Items used during personal care do not have to be clean.", options: ["True", "False"], correct: 1 }
    ]
  },
  // MODULE 20: Safeguarding Adults at Risk (Level 1)
  {
    id: 20,
    name: "Safeguarding Adults at Risk (Level 1)",
    passMark: 15,
    questions: [
      { text: "Everyone should promote best practice to avoid abuse.", options: ["True", "False"], correct: 0 },
      { text: "There is no need to respect individual differences.", options: ["True", "False"], correct: 1 },
      { text: "We all have a duty to protect adults at risk.", options: ["True", "False"], correct: 0 },
      { text: "There is no need to report concerns we may have about abuse.", options: ["True", "False"], correct: 1 },
      { text: "An adult at risk may have an acquired brain injury.", options: ["True", "False"], correct: 0 },
      { text: "Abuse is the violation of an individual's human and civil rights by another.", options: ["True", "False"], correct: 0 },
      { text: "A category of abuse could be defined as sexual.", options: ["True", "False"], correct: 0 },
      { text: "Emotional abuse would not be considered an issue.", options: ["True", "False"], correct: 1 },
      { text: "Neglect is a category of abuse.", options: ["True", "False"], correct: 0 },
      { text: "Discrimination is not classed as abuse.", options: ["True", "False"], correct: 1 },
      { text: "Abuse can be through repeated acts of poor professional practice.", options: ["True", "False"], correct: 0 },
      { text: "When being told of abuse you should remain calm.", options: ["True", "False"], correct: 0 },
      { text: "When being told of abuse you do not need to listen carefully.", options: ["True", "False"], correct: 1 },
      { text: "You should regard claims of abuse seriously.", options: ["True", "False"], correct: 0 },
      { text: "You should not promise to keep secrets when being told of abuse.", options: ["True", "False"], correct: 0 },
      { text: "Never gossip about abuse cases with family members.", options: ["True", "False"], correct: 1 },
      { text: "If you see or hear about abuse you do not have a duty to report it.", options: ["True", "False"], correct: 1 },
      { text: "Bruises on the body could be an indicator of abuse.", options: ["True", "False"], correct: 0 },
      { text: "It is not acceptable to destroy evidence where abuse is claimed.", options: ["True", "False"], correct: 1 },
      { text: "Accurate and detailed reporting is essential where abuse is claimed.", options: ["True", "False"], correct: 0 }
    ]
  },
  // MODULE 21: Safeguarding Adults at Risk (Level 2)
  {
    id: 21,
    name: "Safeguarding Adults at Risk (Level 2)",
    passMark: 15,
    questions: [
      { text: "Which of these statements is correct?", options: ["Only a few staff members need to promote best practice to avoid abuse.", "Only management need to promote best practice to avoid abuse.", "Everyone should promote best practice to avoid abuse."], correct: 2 },
      { text: "Which of these statements is correct?", options: ["Employees do not need to respect individual differences.", "There is no requirement to respect individual differences.", "We need to respect individual differences."], correct: 2 },
      { text: "Which of these statements is correct?", options: ["There is no need to report concerns we may have about abuse.", "We are required to report concerns we may have about abuse.", "We can leave it to others to report concerns we may have about abuse."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["We all have a duty to protect adults at risk.", "Only a few employees have a duty to protect adults at risk.", "Only management have a duty to protect adults at risk."], correct: 0 },
      { text: "Which of these statements is correct?", options: ["Sexual is not defined as a category of abuse.", "A category of abuse could be defined as sexual.", "Categories of abuse do not include sexual."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["Emotional abuse would not be considered an issue.", "Emotional abuse is not considered as important.", "Emotional abuse should be reported."], correct: 2 },
      { text: "Which of these statements is correct?", options: ["Neglect is not considered a category of abuse.", "Neglect is considered a category of abuse.", "There is no need to report when someone is abused through neglect."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["It is ok to write illegible statements about abuse.", "Written statements about abuse need to be legible.", "Only I need to understand the statement about abuse I have written."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["Ensuring 'best evidence' in cases of abuse is important.", "Best evidence' does not help in the prosecution of offenders.", "Ensuring 'best evidence' in cases of abuse is not important."], correct: 0 },
      { text: "Which of these statements is correct?", options: ["Being discriminating would not be classed as a category of abuse.", "There is no need to report cases of discrimination at work.", "Discrimination is considered a category of abuse."], correct: 2 },
      { text: "Which of these statements is correct?", options: ["When being told of abuse you should always panic.", "When being told of abuse you should initially ignore the claim.", "When being told of abuse you should remain calm."], correct: 2 },
      { text: "Which of these statements is correct?", options: ["Abuse can be through repeated acts of poor professional practice.", "Abuse cannot occur through repeated acts of poor professional practice.", "Repeated acts of poor professional practice are not considered abuse."], correct: 0 },
      { text: "Which of these statements is correct?", options: ["When being told of abuse you do not need to listen carefully.", "When being told of abuse only listen to what you find interesting.", "When being told of abuse you need to listen carefully."], correct: 2 },
      { text: "Which of these statements is correct?", options: ["There is no requirement to take claims of abuse seriously.", "You only need to act if there are repeated claims of abuse.", "You should regard any claim of abuse seriously."], correct: 2 },
      { text: "Which of these statements is correct?", options: ["You should not promise to keep secrets when being told of abuse.", "You can promise to keep secrets when being told of abuse.", "When being told of abuse you can promise to keep secrets."], correct: 0 },
      { text: "Which of these statements is correct?", options: ["Gossiping about abuse cases with family members is acceptable.", "Never gossip about abuse cases with family members.", "It is acceptable to gossip about abuse cases with family members."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["If you see or hear about abuse you do not have a duty to report it.", "If you see or hear about abuse you do have a duty to report it.", "You can ignore abuse that you see or hear."], correct: 1 },
      { text: "Which of these statements is correct?", options: ["Bruises on the body would not be an indicator of abuse.", "There is no need to report unexplained bruises on the body.", "Bruises on the body could be an indicator of abuse."], correct: 2 },
      { text: "Which of these statements is correct?", options: ["It is not acceptable to destroy evidence where abuse is claimed.", "It is acceptable to destroy evidence where abuse is claimed.", "Ensuring evidence is not destroyed is not important."], correct: 0 },
      { text: "Which of these statements is correct?", options: ["Accurate and detailed reporting is not essential where abuse is claimed.", "Accurate and detailed reporting is essential where abuse is claimed.", "There is no need for accurate and detailed reporting where abuse is claimed."], correct: 1 }
    ]
  },
  // MODULE 22: Safeguarding Children (Level 1)
  {
    id: 22,
    name: "Safeguarding Children (Level 1)",
    passMark: 15,
    questions: [
      { text: "Everyone should promote best practice to avoid abuse.", options: ["True", "False"], correct: 0 },
      { text: "I do not need to do anything if I am aware a child is being radicalised.", options: ["True", "False"], correct: 1 },
      { text: "We all have a duty to protect children from abuse.", options: ["True", "False"], correct: 0 },
      { text: "There is no need to report concerns we may have about abuse.", options: ["True", "False"], correct: 1 },
      { text: "I should report it if I believe a child is at risk of Female Genital Mutilation.", options: ["True", "False"], correct: 0 },
      { text: "The Police can investigate allegations of child abuse.", options: ["True", "False"], correct: 0 },
      { text: "A category of child abuse could be defined as sexual.", options: ["True", "False"], correct: 0 },
      { text: "Emotional abuse would not be considered an issue.", options: ["True", "False"], correct: 1 },
      { text: "Neglect is a category of child abuse.", options: ["True", "False"], correct: 0 },
      { text: "I do not need to be aware of the indicators of child abuse.", options: ["True", "False"], correct: 1 },
      { text: "There are dangers for children associated with social media.", options: ["True", "False"], correct: 0 },
      { text: "When being told of child abuse you should remain calm.", options: ["True", "False"], correct: 0 },
      { text: "When being told of child abuse you do not need to listen carefully.", options: ["True", "False"], correct: 1 },
      { text: "You should regard claims of child abuse seriously.", options: ["True", "False"], correct: 0 },
      { text: "You should not promise to keep secrets when being told of abuse.", options: ["True", "False"], correct: 0 },
      { text: "It is acceptable to gossip about child abuse cases with family members.", options: ["True", "False"], correct: 1 },
      { text: "It is acceptable to destroy evidence with regard to an abuse claimed.", options: ["True", "False"], correct: 1 },
      { text: "Accurate and detailed reporting is essential with regard to abuse claims.", options: ["True", "False"], correct: 0 },
      { text: "If you see or hear about child abuse you do not have a duty to report it.", options: ["True", "False"], correct: 1 },
      { text: "Bruises on the body could be an indicator of child abuse.", options: ["True", "False"], correct: 0 }
    ]
  },
  // MODULE 23: Understanding Your Role & Duty of Care (Level 1)
  {
    id: 23,
    name: "Understanding Your Role & Duty of Care (Level 1)",
    passMark: 15,
    questions: [
      { text: "My job description can help identify personal development needs.", options: ["True", "False"], correct: 0 },
      { text: "There is no need to protect the rights of those I care for.", options: ["True", "False"], correct: 1 },
      { text: "There is a need to establish and maintain trust and confidence.", options: ["True", "False"], correct: 0 },
      { text: "In my role, I do not have to uphold public trust and confidence.", options: ["True", "False"], correct: 1 },
      { text: "There is a Code of Conduct for Healthcare Workers.", options: ["True", "False"], correct: 0 },
      { text: "I should work in ways agreed with my employer.", options: ["True", "False"], correct: 0 },
      { text: "Some information you must share with your manager or supervisor.", options: ["True", "False"], correct: 0 },
      { text: "There are many people I will work with as a healthcare worker.", options: ["True", "False"], correct: 0 },
      { text: "Maintaining a service user's privacy and dignity are not important.", options: ["True", "False"], correct: 1 },
      { text: "There are qualities and skills that are beneficial to partnership working.", options: ["True", "False"], correct: 0 },
      { text: "There are many sources of support for my learning and development.", options: ["True", "False"], correct: 0 },
      { text: "All healthcare workers should be trained to undertake their role.", options: ["True", "False"], correct: 0 },
      { text: "Employees do not need to have a Personal Development Plan.", options: ["True", "False"], correct: 1 },
      { text: "Employees should be promoting dignity.", options: ["True", "False"], correct: 0 },
      { text: "Personal development as a healthcare worker is important.", options: ["True", "False"], correct: 0 },
      { text: "I do not need to report it if someone is being abused.", options: ["True", "False"], correct: 1 },
      { text: "You do not report colleagues who are abusive or use bad practice.", options: ["True", "False"], correct: 1 },
      { text: "Team meetings are useful as a source of personal development.", options: ["True", "False"], correct: 0 },
      { text: "Promoting a service user's independence is not important.", options: ["True", "False"], correct: 1 },
      { text: "There are laws to protect healthcare workers and those they care for.", options: ["True", "False"], correct: 0 }
    ]
  }
];

async function main() {
  console.log("🌱 Seeding 23 modules with 20 questions each...\n");
  
  for (const mod of modulesData) {
    const formattedQuestions = mod.questions.map((q, idx) => ({
      id: `mod${mod.id}_q${idx + 1}`,
      text: q.text,
      options: q.options || ["True", "False"],
      correct: q.correct
    }));
    
    await prisma.module.upsert({
      where: { id: mod.id },
      update: {
        name: mod.name,
        passMark: mod.passMark,
        questions: JSON.stringify(formattedQuestions)
      },
      create: {
        id: mod.id,
        name: mod.name,
        passMark: mod.passMark,
        questions: JSON.stringify(formattedQuestions)
      }
    });
    
    console.log(`✅ Module ${mod.id}: ${mod.name}`);
  }
  
  console.log("\n✅ Seeding complete! All 23 modules have 20 questions each.");
  console.log("\n📊 Verifying...");
  
  const modules = await prisma.module.findMany({ orderBy: { id: 'asc' } });
  for (const m of modules) {
    const qCount = JSON.parse(m.questions).length;
    console.log(`   Module ${m.id}: ${m.name} - ${qCount}/20 questions - Pass mark: ${m.passMark}/20`);
  }
  
  await prisma.$disconnect();
}

main().catch(console.error);
