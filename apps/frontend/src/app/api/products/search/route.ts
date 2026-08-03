import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim() || '';

    if (!q) {
      return NextResponse.json({ data: [], pagination: { total: 0 } });
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { category: { name: { contains: q, mode: 'insensitive' } } },
        ],
      },
      include: {
        category: true,
        images: true,
      },
      take: 40,
    });

    return NextResponse.json({
      data: products,
      pagination: { total: products.length },
    });
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json({ data: [], pagination: { total: 0 } }, { status: 500 });
  }
}
