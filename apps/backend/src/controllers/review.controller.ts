import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create review (Customer)
export const createReview = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { productId, rating, title, body } = req.body;

    // Optional: check if they bought it
    
    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating: Number(rating),
        title,
        body,
        isApproved: false // Requires admin approval
      }
    });

    res.status(201).json({ success: true, review });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to submit review' });
  }
};

// Get pending reviews (Admin)
export const getPendingReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { isApproved: false },
      include: { user: true, product: true }
    });
    res.json({ success: true, reviews });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch pending reviews' });
  }
};

// Approve review (Admin)
export const approveReview = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const review = await prisma.review.update({
      where: { id },
      data: { isApproved: true }
    });
    res.json({ success: true, review });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to approve review' });
  }
};
