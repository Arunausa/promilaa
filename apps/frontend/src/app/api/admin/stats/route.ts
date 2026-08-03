import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [totalUsers, totalProducts, totalOrders] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
    ]);

    return NextResponse.json({
      stats: {
        totalRevenue: 0,
        totalOrders,
        totalProducts,
        totalUsers,
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
