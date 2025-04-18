import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verify } from 'jsonwebtoken';

// Middleware to verify admin token
async function verifyAdminToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = verify(token, process.env.NEXTAUTH_SECRET || 'your-secret-key') as {
      userId: string;
      isAdmin: boolean;
    };

    if (!decoded.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return null;
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

// GET /api/products - Get all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product (admin only)
export async function POST(request: NextRequest) {
  const authError = await verifyAdminToken(request);
  if (authError) return authError;

  try {
    const { name, image, shortDesc, description, price, stock } = await request.json();

    const product = await prisma.product.create({
      data: {
        name,
        image,
        shortDesc,
        description,
        price,
        stock,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the product' },
      { status: 500 }
    );
  }
}

// PUT /api/products - Update a product (admin only)
export async function PUT(request: NextRequest) {
  const authError = await verifyAdminToken(request);
  if (authError) return authError;

  try {
    const { id, name, image, shortDesc, description, price, stock } = await request.json();

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        image,
        shortDesc,
        description,
        price,
        stock,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products - Delete a product (admin only)
export async function DELETE(request: NextRequest) {
  const authError = await verifyAdminToken(request);
  if (authError) return authError;

  try {
    const { id } = await request.json();

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the product' },
      { status: 500 }
    );
  }
} 