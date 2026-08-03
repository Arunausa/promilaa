import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkPhoneNumberFraud } from '@/lib/fraudChecker';
import { sendOrderConfirmationSMS } from '@/lib/smsService';

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

    // 1. Run Multi-Courier Fraud Checker (Steadfast, Pathao, RedX, Paperfly, Carrybee engine)
    const fraudResult = await checkPhoneNumberFraud(phone, order.id);

    // 2. Trigger Automated SMS Order Confirmation
    await sendOrderConfirmationSMS(phone, order.orderNumber, Number(order.total));

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        paymentMethod: paymentMethod || 'COD',
        riskLevel: fraudResult.status,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 500 });
  }
}
