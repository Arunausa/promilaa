import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, guestPhone, shippingAddress, paymentMethod } = body;

    if (!items || !items.length || !guestPhone || !shippingAddress) {
      return NextResponse.json({ error: 'Items, phone number, and address are required' }, { status: 400 });
    }

    const phone = guestPhone.trim();
    const fullName = shippingAddress.fullName || 'Valued Customer';

    // Calculate Subtotal and Shipping
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      // item can have variantId/id and quantity
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.id },
        include: { product: true },
      });

      if (variant) {
        const itemPrice = Number(variant.price || variant.product.basePrice);
        const itemQty = Number(item.quantity) || 1;
        subtotal += itemPrice * itemQty;

        orderItemsData.push({
          variantId: variant.id,
          quantity: itemQty,
          unitPrice: itemPrice,
        });
      }
    }

    const isInsideDhaka = shippingAddress.district?.toLowerCase().includes('dhaka') || shippingAddress.city?.toLowerCase().includes('dhaka');
    const shippingFee = isInsideDhaka ? 80 : 150;
    const total = subtotal + shippingFee;

    const orderNumber = `PRM-${Date.now().toString().slice(-6)}`;

    // Create Order in DB
    const order = await prisma.order.create({
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

    // Fraud Detection Logic
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    let riskScore = 10;
    let reason = 'Normal phone number';

    // Check previous canceled/returned orders for this phone
    const previousOrders = await prisma.order.findMany({
      where: { guestPhone: phone },
      select: { status: true },
    });

    const cancelledCount = previousOrders.filter(o => o.status === 'CANCELLED' || o.status === 'RETURNED').length;
    
    if (cancelledCount >= 2) {
      riskLevel = 'HIGH';
      riskScore = 85;
      reason = `Customer has ${cancelledCount} previously cancelled/returned orders! High Risk!`;
    } else if (cancelledCount === 1) {
      riskLevel = 'MEDIUM';
      riskScore = 45;
      reason = `Customer has 1 previously cancelled order.`;
    } else if (!/^01[3-9]\d{8}$/.test(phone)) {
      riskLevel = 'HIGH';
      riskScore = 90;
      reason = `Invalid BD Phone number structure (${phone})`;
    }

    // Create FraudReport in DB
    await prisma.fraudReport.create({
      data: {
        orderId: order.id,
        phone,
        riskScore,
        riskLevel,
        provider: 'Promilaa Intelligence Guard',
        reason,
        rawData: { cancelledCount, phoneCheck: 'Passed' },
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        paymentMethod: paymentMethod || 'COD',
        riskLevel,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 500 });
  }
}
