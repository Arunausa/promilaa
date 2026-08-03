import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawOrderNumber = searchParams.get('orderNumber')?.trim() || '';
    const phone = searchParams.get('phone')?.trim() || '';

    if (!rawOrderNumber || !phone) {
      return NextResponse.json({ error: 'Order number and phone number are required' }, { status: 400 });
    }

    // Auto-normalize order number: e.g. "058879" -> "PRM-058879"
    const orderNumber = rawOrderNumber.startsWith('PRM-')
      ? rawOrderNumber
      : `PRM-${rawOrderNumber}`;

    // Normalize phone number (strip whitespace and non-digits)
    const cleanPhone = phone.replace(/\D/g, '');

    const order = await prisma.order.findFirst({
      where: {
        orderNumber: { equals: orderNumber, mode: 'insensitive' },
        OR: [
          { guestPhone: { contains: cleanPhone } },
          { shippingAddress: { path: ['phone'], string_contains: cleanPhone } },
        ],
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
      // Fallback query matching orderNumber only if phone format differs
      const fallbackOrder = await prisma.order.findFirst({
        where: {
          orderNumber: { equals: orderNumber, mode: 'insensitive' }
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

      if (fallbackOrder) {
        return NextResponse.json({ order: fallbackOrder });
      }

      return NextResponse.json({ error: 'Order not found. Please verify your details.' }, { status: 404 });
    }

    return NextResponse.json({ order });

  } catch (error: any) {
    console.error('Order tracking error:', error);
    return NextResponse.json({ error: 'Failed to track order' }, { status: 500 });
  }
}
