import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { uploadImage } from '../services/r2.service';

const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().default(""),
  categoryId: z.string().min(1),
  basePrice: z.number().positive(),
  sku: z.string().min(1),
  isPublished: z.boolean().default(true),
  variants: z.array(z.object({
    color: z.string(),
    size: z.string(),
    sku: z.string(),
    stockQuantity: z.number().int().nonnegative(),
    priceAdjustment: z.number().default(0),
  })).optional(),
  images: z.array(z.object({
    url: z.string().url(),
    altText: z.string().default(""),
    isPrimary: z.boolean().default(false),
    position: z.number().int().default(0),
  })).optional(),
});

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { categorySlug, limit = '20', page = '1', sort, minPrice, maxPrice, inStock } = req.query;
    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;

    const whereClause: any = { isPublished: true };
    if (categorySlug) {
      whereClause.category = { slug: categorySlug as string };
    }

    if (minPrice || maxPrice) {
      whereClause.basePrice = {};
      if (minPrice) whereClause.basePrice.gte = parseFloat(minPrice as string);
      if (maxPrice) whereClause.basePrice.lte = parseFloat(maxPrice as string);
    }

    if (inStock === 'true') {
      whereClause.variants = {
        some: { stockQuantity: { gt: 0 } }
      };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { basePrice: 'asc' };
    else if (sort === 'price_desc') orderBy = { basePrice: 'desc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          category: { select: { name: true, slug: true } },
          images: { orderBy: { position: 'asc' } },
          variants: true,
        },
        skip,
        take,
        orderBy,
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    res.json({
      data: products,
      pagination: {
        total,
        page: parseInt(page as string, 10),
        limit: take,
        totalPages: Math.ceil(total / take),
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { position: 'asc' } },
        variants: true,
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const parsed = createProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid input', errors: parsed.error.format() });
    }

    const { name, slug, description, categoryId, basePrice, sku, isPublished, variants, images } = parsed.data;

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return res.status(409).json({ message: 'Product with this slug already exists' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        categoryId,
        basePrice,
        isPublished,
        variants: variants ? { create: variants } : undefined,
        images: images ? { create: images } : undefined,
      },
      include: { variants: true, images: true },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const parsed = createProductSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid input', errors: parsed.error.format() });
    }

    // Checking slug uniqueness if changing
    if (parsed.data.slug) {
      const existing = await prisma.product.findFirst({
        where: { slug: parsed.data.slug, id: { not: id } },
      });
      if (existing) {
        return res.status(409).json({ message: 'Product with this slug already exists' });
      }
    }

    // For updating variants/images, a real app usually requires a more nuanced approach
    // (e.g. nested upserts or separate endpoints). For simplicity, we are just updating base fields.
    const { variants, images, ...baseData } = parsed.data;

    const product = await prisma.product.update({
      where: { id },
      data: baseData,
    });

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    
    // Prisma will cascade delete variants and images if configured in schema.
    // If not, we might need to delete them manually first. Our schema uses onDelete: Cascade.
    await prisma.product.delete({ where: { id } });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const uploadProductImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { buffer, originalname, mimetype } = req.file;
    
    // Upload to Cloudflare R2
    const publicUrl = await uploadImage(buffer, originalname, mimetype, 'products');

    res.json({ url: publicUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Internal server error during upload' });
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { q, limit = '20', page = '1' } = req.query;

    if (!q || (q as string).trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;
    const query = (q as string).trim();

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          isPublished: true,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ]
        },
        include: {
          category: { select: { name: true, slug: true } },
          images: { orderBy: { position: 'asc' }, take: 1 },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({
        where: {
          isPublished: true,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ]
        }
      })
    ]);

    res.json({
      success: true,
      data: products,
      query,
      pagination: {
        total,
        page: parseInt(page as string, 10),
        limit: take,
        totalPages: Math.ceil(total / take),
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, message: 'Search failed' });
  }
};
