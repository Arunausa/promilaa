import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@promilaa.com';
  const password = 'Promilaa@2026!Secured';

  const hashedPassword = await bcrypt.hash(password, 10);

  const adminUser = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash: hashedPassword,
      role: 'ADMIN',
      name: 'Super Admin',
    },
    create: {
      email,
      passwordHash: hashedPassword,
      role: 'ADMIN',
      name: 'Super Admin',
    },
  });

  console.log('Admin user seeded:', adminUser.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
