import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { checkPhoneNumberFraud } from '../services/fraud.service';

const prisma = new PrismaClient();

function generateOrderNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'PRM-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, shippingAddress, guestEmail, guestPhone, paymentMethod } = req.body;
    
    // Auth user check (if logged in, middleware will attach req.user)
    const userId = (req as any).user?.userId || null;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    const phone = shippingAddress?.phone || guestPhone;
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // 1. FRAUD DETECTION
    const fraudResult = await checkPhoneNumberFraud(phone);
    if (fraudResult.status === 'HIGH') {
      return res.status(403).json({ 
        error: 'We are unable to process this order due to security reasons. Please contact support.',
        code: 'FRAUD_DETECTED'
      });
    }

    // Determine initial status based on fraud result
    const initialStatus = fraudResult.status === 'MEDIUM' ? 'PENDING' : 'PENDING';
    // We will store the suspicious flag in a note or something similar, for now we will just use PENDING.
    // In a real app we might have a specific order status like 'ON_HOLD' or 'REVIEW'.

    // 2. STOCK VERIFICATION AND TOTAL CALCULATION
    let subtotal = 0;
    const orderItemsData: any[] = [];

    // Begin a Prisma Transaction
    const result = await prisma.$transaction(async (tx: any) => {
      for (const item of items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.id }, // item.id is variantId from frontend
          include: { product: true }
        });

        if (!variant) {
          throw new Error(`Variant ${item.id} not found`);
        }

        if (variant.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${variant.product.name} - ${variant.color} - ${variant.size}`);
        }

        const unitPrice = variant.price || variant.product.basePrice;
        subtotal += Number(unitPrice) * item.quantity;

        // Deduct stock
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: item.quantity } }
        });

        orderItemsData.push({
          variantId: variant.id,
          quantity: item.quantity,
          unitPrice: unitPrice
        });
      }

      // Hardcode shipping for now (e.g. 60 inside Dhaka, 120 outside)
      const shippingFee = shippingAddress.district?.toLowerCase() === 'dhaka' ? 60 : 120;
      const total = subtotal + shippingFee;

      // 3. CREATE ORDER
      const orderNumber = generateOrderNumber();
      
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          guestEmail,
          guestPhone: phone,
          status: initialStatus,
          subtotal,
          shippingFee,
          total,
          shippingAddress,
          items: {
            create: orderItemsData
          },
          payment: {
            create: {
              method: paymentMethod || 'COD',
              status: 'PENDING'
            }
          }
        },
        include: {
          items: true,
          payment: true
        }
      });

      return newOrder;
    });

    res.status(201).json({ 
      success: true, 
      order: result, 
      fraudStatus: fraudResult.status 
    });

  } catch (error: any) {
    console.error("Order creation failed:", error);
    res.status(400).json({ error: error.message || 'Failed to create order' });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: { select: { name: true, images: true } }
              }
            }
          }
        },
        payment: true,
      }
    });

    res.json({ orders });
  } catch (error) {
    console.error('Fetch my orders error:', error);
    res.status(500).json({ error: 'Failed to fetch your orders' });
  }
};

// GET /api/orders/track?orderNumber=PRM-XXX&phone=01XXXXXXXXX
export const trackOrder = async (req: Request, res: Response) => {
  try {
    const { orderNumber, phone } = req.query;

    if (!orderNumber || !phone) {
      return res.status(400).json({ error: 'Order number and phone are required' });
    }

    const order = await prisma.order.findFirst({
      where: {
        orderNumber: orderNumber as string,
        OR: [
          { guestPhone: phone as string },
          { shippingAddress: { path: ['phone'], equals: phone } }
        ]
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: { select: { name: true } }
              }
            }
          }
        },
        payment: { select: { method: true, status: true } }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found. Please check your order number and phone.' });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({ error: 'Failed to track order' });
  }
};
