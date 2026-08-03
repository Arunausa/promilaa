import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Customer uploads payment info
export const submitPaymentProof = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId as string;
    const { transactionId, screenshotUrl, method } = req.body;

    const payment = await prisma.payment.update({
      where: { orderId },
      data: {
        method, // e.g. BKASH, NAGAD
        transactionId,
        screenshotUrl,
        status: 'PENDING_VERIFICATION'
      }
    });

    res.json({ success: true, payment });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to submit payment proof' });
  }
};

// Admin gets all pending verifications
export const getPendingPayments = async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { status: 'PENDING_VERIFICATION' },
      include: { order: { include: { user: true } } },
      orderBy: { createdAt: 'asc' }
    });
    res.json({ success: true, payments });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch pending payments' });
  }
};

// Admin verifies payment
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId as string;
    const { status, rejectionReason } = req.body; // VERIFIED or REJECTED
    const adminId = (req as any).user?.userId;

    if (!['VERIFIED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await prisma.$transaction(async (tx: any) => {
      const payment = await tx.payment.update({
        where: { orderId },
        data: {
          status,
          rejectionReason: status === 'REJECTED' ? rejectionReason : null,
          verifiedById: adminId,
          verifiedAt: new Date()
        }
      });

      // Auto advance order to CONFIRMED if verified
      if (status === 'VERIFIED') {
        await tx.order.update({
          where: { id: orderId },
          data: { status: 'CONFIRMED' }
        });
      }

      return payment;
    });

    res.json({ success: true, payment: result });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};
