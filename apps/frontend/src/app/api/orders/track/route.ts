import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// RATE LIMITER: 20 tracking queries per 15 minutes per IP
const trackingRateLimitMap = new Map<string, { count: number; resetAt: number }>();
const TRACKING_RATE_LIMIT = 20;
const TRACKING_WINDOW_MS = 15 * 60 * 1000;

export async function GET(req: Request) {
  // Rate limiting check
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  const entry = trackingRateLimitMap.get(ip);

  if (entry) {
    if (now < entry.resetAt) {
      if (entry.count >= TRACKING_RATE_LIMIT) {
        return NextResponse.json({ error: 'Too many tracking requests. Please try again in 15 minutes.' }, { status: 429 });
      }
      entry.count++;
    } else {
      trackingRateLimitMap.set(ip, { count: 1, resetAt: now + TRACKING_WINDOW_MS });
    }
  } else {
    trackingRateLimitMap.set(ip, { count: 1, resetAt: now + TRACKING_WINDOW_MS });
  }

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

    if (!cleanPhone || cleanPhone.length < 6) {
      return NextResponse.json({ error: 'Valid phone number is required' }, { status: 400 });
    }

    // SECURITY FIX (IDOR): Strictly match BOTH orderNumber AND phone number.
    const order = await prisma.order.findFirst({
      where: {
        orderNumber: { equals: orderNumber, mode: 'insensitive' },
        OR: [
          { guestPhone: { contains: cleanPhone } },
          { shippingAddress: { path: ['phone'], string_contains: cleanPhone } },
        ],
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        subtotal: true,
        shippingFee: true,
        total: true,
        createdAt: true,
        updatedAt: true,
        items: {
          include: {
            variant: {
              include: { product: true }
            }
          }
        },
        payment: {
          select: {
            method: true,
            status: true,
            createdAt: true,
          }
        },
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found. Please verify your order number and phone number.' }, { status: 404 });
    }

    return NextResponse.json({ order });

  } catch (error: any) {
    console.error('Order tracking error:', error);
    return NextResponse.json({ error: 'Failed to track order' }, { status: 500 });
  }
}
