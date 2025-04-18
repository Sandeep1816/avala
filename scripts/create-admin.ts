import { PrismaClient } from '.prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = 'sandeepavala@gmail.com';
    const password = 'Sandeep@21';

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    console.log('Admin user created successfully:', admin);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 