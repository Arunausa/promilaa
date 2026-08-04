import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkPhoneNumberFraud } from '@/lib/fraudChecker';
import crypto from 'crypto';

// RATE LIMITER: 10 checkout orders per 15 minutes per IP
const orderRateLimitMap = new Map<string, { count: number; resetAt: number }>();
const ORDER_RATE_LIMIT = 10;
const ORDER_WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: Request) {
  // Rate limiting check
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  const entry = orderRateLimitMap.get(ip);

  if (entry) {
    if (now < entry.resetAt) {
      if (entry.count >= ORDER_RATE_LIMIT) {
        return NextResponse.json({ error: 'Too many order requests. Please try again in 15 minutes.' }, { status: 429 });
      }
      entry.count++;
    } else {
      orderRateLimitMap.set(ip, { count: 1, resetAt: now + ORDER_WINDOW_MS });
    }
  } else {
    orderRateLimitMap.set(ip, { count: 1, resetAt: now + ORDER_WINDOW_MS });
  }

  try {
    const body = await req.json();
    const { items, guestPhone, shippingAddress, paymentMethod } = body;

    if (!items || !items.length || !guestPhone || !shippingAddress) {
      return NextResponse.json({ error: 'Items, phone number, and address are required' }, { status: 400 });
    }

    const phone = guestPhone.trim();
    const fullName = shippingAddress.fullName || 'Valued Customer';

    // Execute Order Creation & Stock Decrement inside an Atomic Transaction
    const result = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsData = [];

      for (const item of items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.id },
          include: { product: true },
        });

        if (!variant) {
          throw new Error(`Product variant with ID ${item.id} not found.`);
        }

        const itemQty = Number(item.quantity) || 1;

        // ATOMIC CONCURRENCY FIX: Decrement stock only if stock >= itemQty at DB level
        const updatedVariant = await tx.productVariant.updateMany({
          where: {
            id: variant.id,
            stock: { gte: itemQty },
          },
          data: {
            stock: { decrement: itemQty },
          },
        });

        if (updatedVariant.count === 0) {
          throw new Error(`Insufficient stock for ${variant.product.name} (${variant.size}/${variant.color}). Available: ${variant.stock}`);
        }

        const itemPrice = Number(variant.price || variant.product.basePrice);
        subtotal += itemPrice * itemQty;

        orderItemsData.push({
          variantId: variant.id,
          quantity: itemQty,
          unitPrice: itemPrice,
        });

        // Create Inventory Audit Log
        await tx.inventoryLog.create({
          data: {
            variantId: variant.id,
            change: -itemQty,
            reason: `Order Placement`,
          },
        });
      }

      const isInsideDhaka = shippingAddress.district?.toLowerCase().includes('dhaka') || shippingAddress.city?.toLowerCase().includes('dhaka');
      const shippingFee = isInsideDhaka ? 80 : 150;
      const total = subtotal + shippingFee;
      
      // SECURE IDOR FIX: Cryptographic non-sequential Order Number generation
      const secureHash = crypto.randomBytes(4).toString('hex').toUpperCase();
      const orderNumber = `PRM-${Date.now().toString(36).toUpperCase()}-${secureHash}`;

      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          guestEmail: shippingAddress.email || `${phone}@promilaa-guest.com`,
          guestPhone: phone,
          subtotal,
          shippingFee,
          total,
          shippingAddress: {
            fullName,
            phone,
            district: shippingAddress.district || 'Dhaka',
            city: shippingAddress.city || '',
            line1: shippingAddress.line1 || '',
          },
          items: {
            create: orderItemsData,
          },
          payment: {
            create: {
              method: paymentMethod === 'BKASH' ? 'BKASH' : paymentMethod === 'NAGAD' ? 'NAGAD' : 'COD',
              status: 'PENDING',
            },
          },
        },
        include: {
          items: true,
          payment: true,
        },
      });

      return newOrder;
    });

    // Run Multi-Courier Fraud Checker Engine (Non-blocking async call for performance)
    checkPhoneNumberFraud(phone, result.id).catch((err) => {
      console.error('[Fraud Engine Async Error]', err);
    });

    return NextResponse.json({
      success: true,
      order: {
        id: result.id,
        orderNumber: result.orderNumber,
        total: result.total,
        paymentMethod: paymentMethod || 'COD',
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 400 });
  }
}
