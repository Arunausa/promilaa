import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get('orderNumber')?.trim();
    const phone = searchParams.get('phone')?.trim();

    if (!orderNumber || !phone) {
      return NextResponse.json({ error: 'Order number and phone number are required' }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        orderNumber: { equals: orderNumber, mode: 'insensitive' },
        guestPhone: phone,
      },
      include: {
        items: {
          include: {
            variant: {
              include: { product: true }
            }
          }
        },
        payment: true,
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found. Please verify your phone and order number.' }, { status: 404 });
    }

    return NextResponse.json({ order });

  } catch (error: any) {
    console.error('Order tracking error:', error);
    return NextResponse.json({ error: 'Failed to track order' }, { status: 500 });
  }
}
