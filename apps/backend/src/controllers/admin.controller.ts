import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get dashboard stats
export const getStats = async (req: Request, res: Response) => {
  try {
    const totalOrders = await prisma.order.count();
    const totalRevenue = await prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ['DELIVERED', 'SHIPPED', 'PROCESSING', 'CONFIRMED'] } } // Example valid revenue
    });
    const totalProducts = await prisma.product.count();
    const totalUsers = await prisma.user.count({ where: { role: 'CUSTOMER' } });

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        totalProducts,
        totalUsers
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

// Get all orders (with pagination)
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: true, payment: true }
    });
    res.json({ success: true, orders });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });

    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId as string;
    const { status, remarks } = req.body;

    const payment = await prisma.payment.update({
      where: { orderId },
      data: {
        status,
        rejectionReason: remarks,
        verifiedById: (req as any).user.id,
      },
    });

    if (status === 'VERIFIED') {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
      });
    }

    res.json({ payment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment status' });
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isBlocked: true,
        createdAt: true,
        _count: {
          select: { orders: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ customers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

export const toggleBlockCustomer = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { isBlocked } = req.body;
    
    const user = await prisma.user.update({
      where: { id, role: 'CUSTOMER' },
      data: { isBlocked: isBlocked },
      select: { id: true, name: true, isBlocked: true }
    });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer status' });
  }
};
