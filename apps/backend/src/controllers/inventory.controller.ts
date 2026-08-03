import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/inventory — list all variants with stock info
export const getInventory = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '50' } = req.query;
    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;

    const [variants, total] = await Promise.all([
      prisma.productVariant.findMany({
        orderBy: { stock: 'asc' },
        skip,
        take,
        include: {
          product: { select: { name: true, slug: true } }
        }
      }),
      prisma.productVariant.count()
    ]);

    res.json({
      success: true,
      data: variants,
      pagination: {
        total,
        page: parseInt(page as string, 10),
        limit: take,
        totalPages: Math.ceil(total / take),
      }
    });
  } catch (error) {
    console.error('Inventory fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch inventory' });
  }
};

// GET /api/inventory/low-stock — variants with stock <= 5
export const getLowStockInventory = async (req: Request, res: Response) => {
  try {
    const variants = await prisma.productVariant.findMany({
      where: { stock: { lte: 5 } },
      orderBy: { stock: 'asc' },
      include: {
        product: { select: { name: true, slug: true } }
      }
    });

    res.json({ success: true, data: variants, total: variants.length });
  } catch (error) {
    console.error('Low stock fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch low stock items' });
  }
};

// PUT /api/inventory/:variantId — update stock for a variant
export const updateInventory = async (req: Request, res: Response) => {
  try {
    const variantId = req.params.variantId as string;
    const { stock, reason } = req.body;

    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ success: false, message: 'Valid stock value required' });
    }

    const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant) {
      return res.status(404).json({ success: false, message: 'Variant not found' });
    }

    const change = stock - variant.stock;

    const [updatedVariant] = await prisma.$transaction([
      prisma.productVariant.update({
        where: { id: variantId },
        data: { stock }
      }),
      prisma.inventoryLog.create({
        data: {
          variantId,
          change,
          reason: reason || 'Manual admin update'
        }
      })
    ]);

    res.json({ success: true, data: updatedVariant });
  } catch (error) {
    console.error('Inventory update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update inventory' });
  }
};
