import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/adminAuth';

export async function GET(req: Request) {
  const admin = await verifyAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  try {
    const [totalUsers, totalProducts, totalOrders, revenueAgg] = await Promise.all([
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { notIn: ['CANCELLED', 'RETURNED'] } },
      }),
    ]);

    const totalRevenue = Number(revenueAgg._sum.total || 0);

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
      },
    }, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({
      stats: { totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalUsers: 0 },
    }, { status: 500 });
  }
}
