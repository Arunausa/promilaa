import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Force dynamic — never cache this route (announcement bar needs fresh data)
export const dynamic = 'force-dynamic';

interface StoreSettingRow {
  id: string;
  key: string;
  value: string;
  updatedAt: Date;
}

export async function GET() {
  try {
    const rows = await (prisma as any).storeSetting.findMany({
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

    rows.forEach((row: StoreSettingRow) => {
      if (row.key === "announcementEnabled") {
        publicSettings[row.key] = row.value === "true";
      } else {
        publicSettings[row.key] = row.value;
      }
    });

    return NextResponse.json(publicSettings, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      }
    });
  } catch (error) {
    return NextResponse.json({
      announcementEnabled: true,
      announcementText: "🌸 ক্যাশ অন ডেলিভারিতে শপিং করুন - সারা বাংলাদেশে হোম ডেলিভারি! 🌸",
    });
  }
}
