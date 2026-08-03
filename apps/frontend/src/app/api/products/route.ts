import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cacheGet, cacheSet, cacheDel } from '@/lib/redisCache';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get('limit')) || 100;
    const categorySlug = searchParams.get('category');

    const cacheKey = `products:list:limit=${limit}:category=${categorySlug || 'all'}`;

    // 1. Try High-Speed Redis / In-Memory Cache first (0ms latency)
    const cachedData = await cacheGet(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const where: any = {
      isPublished: true,
    };

    if (categorySlug && categorySlug !== 'all') {
      where.category = {
        slug: { equals: categorySlug, mode: 'insensitive' },
      };
    }

    const products = await prisma.product.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        images: { orderBy: { position: 'asc' } },
        variants: true,
      },
    });

    const responsePayload = {
      data: products,
      pagination: { total: products.length },
    };

    // 2. Cache result for 60 seconds for ultra-fast 100k+ visitor response
    await cacheSet(cacheKey, responsePayload, 60);

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    console.error('Failed to fetch products API:', error);
    return NextResponse.json({ data: [], error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, description, basePrice, categoryId, sku, variants, images } = body;

    const product = await prisma.product.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: description || '',
        basePrice: Number(basePrice),
        categoryId,
        isPublished: true,
        variants: {
          create: variants && variants.length > 0 ? variants.map((v: any) => ({
            sku: v.sku || `${slug}-${v.size || 'FS'}-${Date.now().toString().slice(-4)}`,
            size: v.size || 'Free Size',
            color: v.color || 'Default',
            price: v.price ? Number(v.price) : Number(basePrice),
            stock: Number(v.stock || v.stockQuantity) || 10,
          })) : [{
            sku: `${slug}-DEFAULT-${Date.now().toString().slice(-4)}`,
            size: 'Free Size',
            color: 'Default',
            price: Number(basePrice),
            stock: 10,
          }],
        },
        images: {
          create: images && images.length > 0 ? images.map((img: any, i: number) => ({
            url: typeof img === 'string' ? img : img.url,
            altText: name,
            position: i,
          })) : [{
            url: 'https://placehold.co/600x800/png?text=Promilaa+Ethnic+Wear',
            altText: name,
            position: 0,
          }],
        },
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });

    // Invalidate product catalog cache on new product creation
    await cacheDel('products:list');

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
