import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createBanner = async (req: Request, res: Response) => {
  try {
    const { title, imageUrl, linkUrl, placement, position, isActive, startsAt, endsAt } = req.body;
    
    if (!title || !imageUrl || !placement) {
      return res.status(400).json({ error: 'title, imageUrl, and placement are required' });
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        imageUrl,
        linkUrl,
        placement,
        position: position || 0,
        isActive: isActive !== undefined ? isActive : true,
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null,
      },
    });

    res.status(201).json({ banner });
  } catch (error: any) {
    console.error('Create banner error:', error);
    res.status(500).json({ error: 'Failed to create banner' });
  }
};

export const getBanners = async (req: Request, res: Response) => {
  try {
    const { placement, activeOnly } = req.query;
    
    const whereClause: any = {};
    if (placement) whereClause.placement = String(placement);
    if (activeOnly === 'true') whereClause.isActive = true;

    const banners = await prisma.banner.findMany({
      where: whereClause,
      orderBy: { position: 'asc' },
    });

    res.json({ banners });
  } catch (error: any) {
    console.error('Fetch banners error:', error);
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
};

export const updateBanner = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, imageUrl, linkUrl, placement, position, isActive, startsAt, endsAt } = req.body;

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(imageUrl && { imageUrl }),
        ...(linkUrl !== undefined && { linkUrl }),
        ...(placement && { placement }),
        ...(position !== undefined && { position }),
        ...(isActive !== undefined && { isActive }),
        ...(startsAt !== undefined && { startsAt: startsAt ? new Date(startsAt) : null }),
        ...(endsAt !== undefined && { endsAt: endsAt ? new Date(endsAt) : null }),
      },
    });

    res.json({ banner });
  } catch (error: any) {
    console.error('Update banner error:', error);
    res.status(500).json({ error: 'Failed to update banner' });
  }
};

export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.banner.delete({ where: { id } });
    res.json({ message: 'Banner deleted successfully' });
  } catch (error: any) {
    console.error('Delete banner error:', error);
    res.status(500).json({ error: 'Failed to delete banner' });
  }
};
