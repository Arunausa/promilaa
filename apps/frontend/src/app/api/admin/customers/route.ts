import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
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
