import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

interface RouteParams {
  params: {
    id: string;
  };
}

// Update user
export async function PUT(request: Request, { params }: RouteParams) {
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

    const { id } = params;
    const { name, email, mobile, password, address } = await request.json();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if email or mobile is already taken by another user
    if (email || mobile) {
      const duplicateUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email || undefined },
            { mobile: mobile || undefined },
          ],
          NOT: {
            id,
          },
        },
      });

      if (duplicateUser) {
        return NextResponse.json(
          { error: 'Email or mobile number already in use' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      name: name || undefined,
      email: email || undefined,
      mobile: mobile || undefined,
      address: address || undefined,
    };

    // Hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        address: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// Delete user
export async function DELETE(request: Request, { params }: RouteParams) {
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

    const { id } = params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
} 