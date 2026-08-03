import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/adminAuth';

export async function GET(req: Request) {
  const admin = await verifyAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        fraudReport: true,
        payment: true,
        items: {
          include: {
            variant: {
              include: { product: true }
            }
          }
        }
      }
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
