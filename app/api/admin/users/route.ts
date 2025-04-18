import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// Get all users
export async function GET(request: Request) {
  try {
    // Verify admin token
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isValid = await verifyAdminToken(token);
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        address: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// Create new user
export async function POST(request: Request) {
  try {
    // Verify admin token
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isValid = await verifyAdminToken(token);
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, mobile, password, address } = await request.json();

    // Validate required fields
    if (!name || !email || !mobile || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { mobile },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or mobile already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        mobile,
        password: hashedPassword,
        address,
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        address: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 