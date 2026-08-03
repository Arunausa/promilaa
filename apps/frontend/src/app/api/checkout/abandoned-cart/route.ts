import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/adminAuth';

const db = prisma as any;

// POST: Save or update draft abandoned cart from checkout form
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, fullName, line1, city, district, items, subtotal } = body;

    if (!phone || phone.length < 11 || !items || !items.length) {
      return NextResponse.json({ error: 'Valid phone and cart items required' }, { status: 400 });
    }

    const cleanPhone = phone.trim();

    // Check if an active abandoned cart already exists for this phone number
    const existing = await db.abandonedCart.findFirst({
      where: {
        phone: cleanPhone,
        isRecovered: false,
      },
    });

    if (existing) {
      const updated = await db.abandonedCart.update({
        where: { id: existing.id },
        data: {
          fullName,
          line1,
          city,
          district,
          cartData: items,
          subtotal: Number(subtotal) || 0,
        },
      });
      return NextResponse.json({ success: true, cart: updated });
    }

    const newCart = await db.abandonedCart.create({
      data: {
        phone: cleanPhone,
        fullName,
        line1,
        city,
        district,
        cartData: items,
        subtotal: Number(subtotal) || 0,
      },
    });

    return NextResponse.json({ success: true, cart: newCart }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to save abandoned cart:', error);
    return NextResponse.json({ error: error.message || 'Failed to save abandoned cart' }, { status: 500 });
  }
}

// GET: Fetch all active abandoned carts for Admin Panel
export async function GET(req: Request) {
  const admin = await verifyAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  try {
    const carts = await db.abandonedCart.findMany({
      where: { isRecovered: false },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ carts });
  } catch (error: any) {
    console.error('Failed to fetch abandoned carts:', error);
    return NextResponse.json({ error: 'Failed to fetch abandoned carts' }, { status: 500 });
  }
}
