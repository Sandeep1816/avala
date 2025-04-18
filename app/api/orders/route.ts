import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verify } from 'jsonwebtoken';
import { getUserIdFromToken } from '@/lib/auth';

// Middleware to verify user token
async function verifyUserToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = verify(token, process.env.NEXTAUTH_SECRET || 'your-secret-key') as {
      userId: string;
      isAdmin: boolean;
    };

    return decoded;
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

// GET /api/orders - Get user's orders or all orders (admin)
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  const decoded = await verifyUserToken(request);
  if ('error' in decoded) return decoded;

  try {
    const { address, paymentId } = await request.json();

    // Get user's cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: decoded.userId },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Calculate total
    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: decoded.userId,
        total,
        status: 'pending',
        address,
        paymentId,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Update product stock
    await Promise.all(
      cartItems.map((item) =>
        prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      )
    );

    // Clear user's cart
    await prisma.cartItem.deleteMany({
      where: { userId: decoded.userId },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the order' },
      { status: 500 }
    );
  }
}

// PUT /api/orders - Update order status (admin only)
export async function PUT(request: NextRequest) {
  const decoded = await verifyUserToken(request);
  if ('error' in decoded) return decoded;

  if (!decoded.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { orderId, status } = await request.json();

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the order' },
      { status: 500 }
    );
  }
} 