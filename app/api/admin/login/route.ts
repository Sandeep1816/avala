import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.NEXTAUTH_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    // Return success response with token
    return NextResponse.json({
      success: true,
      token,
      redirect: '/admin/dashboard',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
} 