import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/adminAuth';

export async function GET(req: Request) {
  const admin = await verifyAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  try {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { orders: true } },
      },
    });
    return NextResponse.json({ customers });
  } catch (error) {
    return NextResponse.json({ customers: [] }, { status: 500 });
  }
}
