const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const courses = [
    { title: 'COSHH Awareness (Level 1)', type: 'Full Access' },
    { title: 'Dementia Awareness (Level 1)', type: 'Full Access' },
    { title: 'Effective Communication (Level 1)', type: 'Full Access' },
    { title: 'End of Life Care (Level 1)', type: 'Full Access' },
    { title: 'Epilepsy Awareness (Level 2)', type: 'Full Access' },
    { title: 'Equality & Diversity (Level 1)', type: 'Full Access' },
    { title: 'Fire Safety (Level 1)', type: 'Full Access' },
    { title: 'First Aid Basic Life Support (Level 1)', type: 'Full Access' },
    { title: 'Food Hygiene (Level 1)', type: 'Full Access' },
    { title: 'Food Hygiene (Level 2)', type: 'Full Access' },
    { title: 'Health & Safety (Level 1)', type: 'Full Access' },
    { title: 'Infection Control (Level 2)', type: 'Full Access' },
    { title: 'Medication Awareness (Level 1)', type: 'Full Access' },
    { title: 'Medication Awareness (Level 2)', type: 'Full Access' },
    { title: 'Mental Capacity Act & DOLS (Level 1)', type: 'Full Access' },
    { title: 'Nutrition & Fluids (Level 1)', type: 'Full Access' },
    { title: 'People Movers Moving & Handling (Level 1)', type: 'Full Access' },
    { title: 'Person Centred Care (Level 1)', type: 'Full Access' },
    { title: 'Personal & Pressure Care (Level 1)', type: 'Full Access' },
    { title: 'Safeguarding Adults at Risk (Level 1)', type: 'Full Access' },
    { title: 'Safeguarding Adults at Risk (Level 2)', type: 'Full Access' },
    { title: 'Safeguarding Children (Level 1)', type: 'Full Access' },
    { title: 'Understanding Your Role & Duty of Care (Level 1)', type: 'Full Access' },
    { title: 'CPR Refresher', type: 'Short Course' },
    { title: 'Manual Handling Refresher', type: 'Short Course' },
    { title: 'Fire Marshal Training', type: 'Short Course' },
    { title: 'First Aid at Work (3 Day)', type: 'Short Course' },
    { title: 'Emergency First Aid at Work', type: 'Short Course' },
    { title: 'Food Safety Level 2', type: 'Short Course' },
    { title: 'Safeguarding Refresher', type: 'Short Course' }
];

async function seed() {
    console.log('Seeding courses...\n');
    let count = 0;
    for (const c of courses) {
        try {
            // Check if it already exists by title
            const existing = await prisma.course.findFirst({ where: { title: c.title } });
            if (existing) {
                console.log(`→ Skipping (already exists): ${c.title}`);
                continue;
            }
            await prisma.$executeRaw`
                INSERT INTO "Course" (id, "courseId", title, type, "updatedAt")
                VALUES (
                    gen_random_uuid()::text,
                    'CRS-' || LPAD((
                        SELECT COALESCE(MAX(CASE WHEN "courseId" LIKE 'CRS-%' THEN SUBSTRING("courseId" FROM 5)::int ELSE 0 END), 0) + 1 FROM "Course"
                    )::text, 3, '0'),
                    ${c.title}, ${c.type}, NOW()
                )
            `;
            console.log(`✓ ${c.title} (${c.type})`);
            count++;
        } catch (e) {
            console.error(`✗ ${c.title}:`, e.message);
        }
    }
    console.log(`\nDone. Inserted ${count} new courses.`);
    await prisma.$disconnect();
}

seed();
