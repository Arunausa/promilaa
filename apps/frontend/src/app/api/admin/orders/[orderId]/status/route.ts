import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/adminAuth';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const admin = await verifyAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const { status } = await req.json();

    const updatedOrder = await prisma.order.update({
      where: { id: resolvedParams.orderId },
      data: { status },
    });

    return NextResponse.json({ order: updatedOrder });
  } catch (error: any) {
    console.error('Failed to update order status:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
