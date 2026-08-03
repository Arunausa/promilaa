import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { position: 'asc' },
    });
    return NextResponse.json({ banners });
  } catch (error) {
    return NextResponse.json({ banners: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const banner = await prisma.banner.create({
      data: {
        title: body.title,
        imageUrl: body.imageUrl,
        linkUrl: body.linkUrl || null,
        placement: body.placement || 'homepage_hero',
        position: Number(body.position) || 0,
        isActive: body.isActive !== false,
      },
    });
    return NextResponse.json(banner, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to create banner' }, { status: 500 });
  }
}
