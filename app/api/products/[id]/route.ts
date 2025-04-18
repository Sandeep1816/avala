import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin token
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    const isValid = await verifyAdminToken(token);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin token
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    const isValid = await verifyAdminToken(token);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, image, shortDesc, description, price, stock } = body;

    // Validate required fields
    if (!name || !image || !shortDesc || !description || price === undefined || stock === undefined) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate price and stock
    if (price < 0 || stock < 0) {
      return NextResponse.json(
        { error: 'Price and stock must be non-negative' },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        image,
        shortDesc,
        description,
        price,
        stock,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
} 