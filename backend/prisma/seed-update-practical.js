const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Updating modules - marking 8 and 17 as practical...');
  
  await prisma.module.update({
    where: { id: 8 },
    data: { isPractical: true }
  });
  console.log('Module 8 marked as practical');
  
  await prisma.module.update({
    where: { id: 17 },
    data: { isPractical: true }
  });
  console.log('Module 17 marked as practical');
  
  console.log('Update complete!');
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());
