import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const test = await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ success: true, data: test });
  } catch (error) {
    console.error('Test route error:', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
} 