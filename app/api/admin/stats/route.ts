import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

interface Order {
  total: number;
}

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

    // Fetch statistics
    const [totalProducts, totalOrders, totalUsers, orders] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.findMany({
        select: {
          total: true,
        },
      }),
    ]);

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum: number, order: Order) => sum + order.total, 0);

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
} 