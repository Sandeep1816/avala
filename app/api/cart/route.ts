import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key';

// Helper function to get user ID from token
const getUserIdFromToken = (request: NextRequest) => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('Missing or invalid Authorization header');
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    console.log('Verifying token:', token);
    const decoded = verify(token, JWT_SECRET) as { userId: string; isAdmin: boolean };
    console.log('Token decoded:', decoded);
    return decoded.userId;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

// Get cart items
export async function GET(request: NextRequest) {
  const userId = getUserIdFromToken(request);
  if (!userId) {
    console.error('Unauthorized: No valid user ID from token');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// Add item to cart
export async function POST(request: NextRequest) {
  const userId = getUserIdFromToken(request);
  if (!userId) {
    console.error('Unauthorized: No valid user ID from token');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productId, quantity } = await request.json();
    console.log('Adding to cart:', { userId, productId, quantity });

    // Check if product exists and has enough stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      console.error('Product not found:', productId);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      console.error('Not enough stock:', { productId, requested: quantity, available: product.stock });
      return NextResponse.json(
        { error: 'Not enough stock available' },
        { status: 400 }
      );
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingItem) {
      // Update quantity if item exists
      console.log('Updating existing cart item:', existingItem.id);
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
        include: {
          product: true,
        },
      });

      return NextResponse.json(updatedItem);
    }

    // Create new cart item
    console.log('Creating new cart item');
    const newItem = await prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(newItem);
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

// Update cart item quantity
export async function PUT(request: NextRequest) {
  const userId = getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { cartItemId, quantity } = await request.json();

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId,
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Check if product has enough stock
    if (cartItem.product.stock < quantity) {
      return NextResponse.json(
        { error: 'Not enough stock available' },
        { status: 400 }
      );
    }

    // Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        product: true,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// Remove item from cart
export async function DELETE(request: NextRequest) {
  const userId = getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { cartItemId } = await request.json();

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return NextResponse.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove from cart' },
      { status: 500 }
    );
  }
} 