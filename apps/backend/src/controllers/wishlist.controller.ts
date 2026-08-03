import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getWishlist = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const items = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: { images: true }
        }
      }
    });
    res.json({ success: true, items });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
};

export const toggleWishlist = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { productId } = req.body;

    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } }
    });

    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } });
      return res.json({ success: true, action: 'removed' });
    } else {
      const item = await prisma.wishlist.create({
        data: { userId, productId }
      });
      return res.json({ success: true, action: 'added', item });
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to toggle wishlist' });
  }
};
