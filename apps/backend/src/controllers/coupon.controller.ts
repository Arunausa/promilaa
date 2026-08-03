import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all coupons (Admin)
export const getCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { startsAt: 'desc' } });
    res.json({ success: true, coupons });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
};

// Create coupon (Admin)
export const createCoupon = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const coupon = await prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        type: data.type,
        value: data.value,
        minOrderAmount: data.minOrderAmount,
        maxUses: data.maxUses,
        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        isActive: data.isActive
      }
    });
    res.status(201).json({ success: true, coupon });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create coupon' });
  }
};

// Validate coupon (Customer checkout)
export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code, cartTotal } = req.body;
    
    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    
    if (!coupon || !coupon.isActive) {
      return res.status(400).json({ error: 'Invalid or inactive coupon' });
    }
    
    if (coupon.startsAt && new Date() < coupon.startsAt) {
      return res.status(400).json({ error: 'Coupon is not active yet' });
    }
    
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return res.status(400).json({ error: 'Coupon has expired' });
    }
    
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ error: 'Coupon usage limit reached' });
    }
    
    if (coupon.minOrderAmount && cartTotal < Number(coupon.minOrderAmount)) {
      return res.status(400).json({ error: `Minimum order amount of ৳${coupon.minOrderAmount} required` });
    }

    res.json({ success: true, coupon });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to validate coupon' });
  }
};
