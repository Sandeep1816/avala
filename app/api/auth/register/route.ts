import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { name, mobile, email, password, address } = await request.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { mobile },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this mobile number already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        mobile,
        email,
        password: hashedPassword,
        address,
        isAdmin: false, // Default value for regular users
      },
    });

    // Remove sensitive data from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: 'User registered successfully', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
} 