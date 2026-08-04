import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// RATE LIMITER: 60 search queries per 1 minute per IP
const searchRateLimitMap = new Map<string, { count: number; resetAt: number }>();
const SEARCH_RATE_LIMIT = 60;
const SEARCH_WINDOW_MS = 60 * 1000;

export async function GET(req: Request) {
  // Rate limiting check
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  const entry = searchRateLimitMap.get(ip);

  if (entry) {
    if (now < entry.resetAt) {
      if (entry.count >= SEARCH_RATE_LIMIT) {
        return NextResponse.json({ data: [], pagination: { total: 0 }, error: 'Too many search requests. Please slow down.' }, { status: 429 });
      }
      entry.count++;
    } else {
      searchRateLimitMap.set(ip, { count: 1, resetAt: now + SEARCH_WINDOW_MS });
    }
  } else {
    searchRateLimitMap.set(ip, { count: 1, resetAt: now + SEARCH_WINDOW_MS });
  }

  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim() || '';

    if (!q) {
      return NextResponse.json({ data: [], pagination: { total: 0 } });
    }

    // Split search query into individual words for multi-term fuzzy matching
    const searchTerms = q.split(/\s+/).filter(Boolean);

    // Build fuzzy OR conditions for each search term
    const searchConditions = searchTerms.map((term) => ({
      OR: [
        { name: { contains: term, mode: 'insensitive' as const } },
        { slug: { contains: term, mode: 'insensitive' as const } },
        { description: { contains: term, mode: 'insensitive' as const } },
        { category: { name: { contains: term, mode: 'insensitive' as const } } },
        { category: { slug: { contains: term, mode: 'insensitive' as const } } },
        { variants: { some: { color: { contains: term, mode: 'insensitive' as const } } } },
        { variants: { some: { size: { contains: term, mode: 'insensitive' as const } } } },
      ],
    }));

    const products = await prisma.product.findMany({
      where: {
        isPublished: true,
        AND: searchConditions,
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { position: 'asc' } },
        variants: true,
      },
      take: 40,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      data: products,
      pagination: { total: products.length },
    }, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json({ data: [], pagination: { total: 0 } }, { status: 500 });
  }
}
