import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';

const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  gender: z.string().optional(),
  parentId: z.string().optional(),
});

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        children: true, // Fetch nested categories one level deep
      },
      where: {
        parentId: null, // Only fetch top-level categories, children are nested
      },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const category = await prisma.category.findUnique({
      where: { slug },
      include: { children: true },
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const parsed = createCategorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid input', errors: parsed.error.format() });
    }

    const { name, slug, parentId, gender } = parsed.data;

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return res.status(409).json({ message: 'Category with this slug already exists' });
    }

    const category = await prisma.category.create({
      data: { name, slug, parentId, gender },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const parsed = createCategorySchema.partial().safeParse(req.body); // Allow partial updates
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid input', errors: parsed.error.format() });
    }

    // Check if updating slug to one that already exists
    if (parsed.data.slug) {
      const existing = await prisma.category.findFirst({
        where: { slug: parsed.data.slug, id: { not: id } },
      });
      if (existing) {
        return res.status(409).json({ message: 'Category with this slug already exists' });
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: parsed.data,
    });

    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    
    // Check if category has children before deleting
    const category = await prisma.category.findUnique({
      where: { id },
      include: { children: true },
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.children.length > 0) {
      return res.status(400).json({ message: 'Cannot delete a category that has subcategories' });
    }

    await prisma.category.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
