import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'arunausa902@gmail.com';
  const password = 'Akib00@@';
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash: hashedPassword,
      role: 'ADMIN',
      name: 'Promilaa Super Admin',
      isBlocked: false,
    },
    create: {
      email,
      passwordHash: hashedPassword,
      name: 'Promilaa Super Admin',
      role: 'ADMIN',
      phone: '01601708251',
    },
  });

  console.log('✅ Admin User Successfully Configured in DB:', admin.email, 'Role:', admin.role);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
