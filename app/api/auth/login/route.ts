import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { mobile, password } = await request.json();

    // Find user by mobile number
    const user = await prisma.user.findUnique({
      where: { mobile },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid mobile number or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid mobile number or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = sign(
      { userId: user.id, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Remove sensitive data from response
    const { password: _, ...userWithoutPassword } = user;

    // Return response with user data and token
    return NextResponse.json({
      user: userWithoutPassword,
      token: token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
} 