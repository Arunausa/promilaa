import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { checkPhoneNumberFraud } from '../services/fraud.service';

const prisma = new PrismaClient();

// POST /api/fraud/check — manually check a phone number (Admin)
export const checkFraud = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const result = await checkPhoneNumberFraud(phone);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Manual fraud check error:', error);
    res.status(500).json({ success: false, message: 'Failed to perform fraud check' });
  }
};

// GET /api/fraud/history — list all fraud reports (Admin)
export const getFraudHistory = async (req: Request, res: Response) => {
  try {
    const { riskLevel, page = '1', limit = '20' } = req.query;
    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;

    const where: Record<string, unknown> = {};
    if (riskLevel) {
      where.riskLevel = riskLevel;
    }

    const [reports, total] = await Promise.all([
      prisma.fraudReport.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          order: {
            select: { orderNumber: true }
          }
        }
      }),
      prisma.fraudReport.count({ where })
    ]);

    res.json({
      success: true,
      data: reports,
      pagination: {
        total,
        page: parseInt(page as string, 10),
        limit: take,
        totalPages: Math.ceil(total / take),
      }
    });
  } catch (error) {
    console.error('Fraud history error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch fraud history' });
  }
};

// GET /api/fraud/report/:orderId — get fraud report for a specific order (Admin)
export const getFraudReportByOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId as string;

    const report = await prisma.fraudReport.findUnique({
      where: { orderId },
      include: {
        order: {
          select: { orderNumber: true, status: true, guestPhone: true }
        }
      }
    });

    if (!report) {
      return res.status(404).json({ success: false, message: 'Fraud report not found for this order' });
    }

    res.json({ success: true, data: report });
  } catch (error) {
    console.error('Fraud report error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch fraud report' });
  }
};

// POST /api/fraud/recheck — re-run fraud check for an existing order (Admin)
export const recheckFraud = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId is required' });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { guestPhone: true }
    });

    if (!order || !order.guestPhone) {
      return res.status(404).json({ success: false, message: 'Order not found or no phone number' });
    }

    const result = await checkPhoneNumberFraud(order.guestPhone, orderId);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Recheck fraud error:', error);
    res.status(500).json({ success: false, message: 'Failed to recheck fraud' });
  }
};
