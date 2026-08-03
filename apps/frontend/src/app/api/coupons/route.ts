import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { code: 'asc' },
    });
    return NextResponse.json({ coupons });
  } catch (error) {
    return NextResponse.json({ coupons: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const coupon = await prisma.coupon.create({
      data: {
        code: body.code.toUpperCase(),
        type: body.discountType === 'FIXED_AMOUNT' ? 'FLAT' : 'PERCENTAGE',
        value: Number(body.discountValue),
        minOrderAmount: Number(body.minOrderAmount) || 0,
        maxUses: Number(body.maxUses) || 100,
        isActive: body.isActive !== false,
      },
    });
    return NextResponse.json(coupon, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to create coupon' }, { status: 500 });
  }
}
