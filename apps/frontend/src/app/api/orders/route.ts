import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkPhoneNumberFraud } from '@/lib/fraudChecker';

export async function POST(req: Request) {
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

        if (variant.stock < itemQty) {
          throw new Error(`Insufficient stock for ${variant.product.name} (${variant.size}/${variant.color}). Available: ${variant.stock}`);
        }

        const itemPrice = Number(variant.price || variant.product.basePrice);
        subtotal += itemPrice * itemQty;

        orderItemsData.push({
          variantId: variant.id,
          quantity: itemQty,
          unitPrice: itemPrice,
        });

        // Decrement stock atomically
        await tx.productVariant.update({
          where: { id: variant.id },
          data: {
            stock: {
              decrement: itemQty,
            },
          },
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
      const orderNumber = `PRM-${Date.now().toString().slice(-6)}`;

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

    // Run Multi-Courier Fraud Checker Engine
    const fraudResult = await checkPhoneNumberFraud(phone, result.id);

    return NextResponse.json({
      success: true,
      order: {
        id: result.id,
        orderNumber: result.orderNumber,
        total: result.total,
        paymentMethod: paymentMethod || 'COD',
        riskLevel: fraudResult.status,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 400 });
  }
}
