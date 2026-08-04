import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const revalidate = 10; // Cache for 10 seconds across CDN/Vercel edge

export async function GET() {
  try {
    const rows = await prisma.storeSetting.findMany({
      where: {
        key: {
          in: ['announcementEnabled', 'announcementText', 'storeName', 'storePhone', 'shippingDhaka', 'shippingOutsideDhaka']
        }
      }
    });

    const publicSettings: Record<string, any> = {
      announcementEnabled: true,
      announcementText: "🌸 ক্যাশ অন ডেলিভারিতে শপিং করুন - সারা বাংলাদেশে হোম ডেলিভারি! 🌸",
      storeName: "PROMILAA BY SOPNIL",
      storePhone: "01601708251",
      shippingDhaka: "80",
      shippingOutsideDhaka: "150",
    };

    rows.forEach((row) => {
      if (row.key === "announcementEnabled") {
        publicSettings[row.key] = row.value === "true";
      } else {
        publicSettings[row.key] = row.value;
      }
    });

    return NextResponse.json(publicSettings, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
      }
    });
  } catch (error) {
    return NextResponse.json({
      announcementEnabled: true,
      announcementText: "🌸 ক্যাশ অন ডেলিভারিতে শপিং করুন - সারা বাংলাদেশে হোম ডেলিভারি! 🌸",
    });
  }
}
