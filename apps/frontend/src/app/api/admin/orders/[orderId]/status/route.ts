import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
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
