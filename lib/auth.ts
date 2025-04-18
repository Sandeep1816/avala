import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
}

export async function getUserIdFromToken(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    return !!user;
  } catch (error) {
    return false;
  }
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    if (!process.env.NEXTAUTH_SECRET) {
      console.error('NEXTAUTH_SECRET is not defined');
      return false;
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    // Check if the token has expired
    if (typeof decoded === 'object' && decoded.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
} 