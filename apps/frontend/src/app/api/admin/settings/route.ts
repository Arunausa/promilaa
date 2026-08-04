import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/adminAuth';

const DEFAULT_SETTINGS: Record<string, string> = {
  storeName: "PROMILAA BY SOPNIL",
  storePhone: "01601708251",
  storeEmail: "support@promilaa.com",
  bkashNumber: "01601708251",
  nagadNumber: "01601708251",
  rocketNumber: "01601708251",
  shippingDhaka: "80",
  shippingOutsideDhaka: "150",
  announcementEnabled: "true",
  announcementText: "🌸 ক্যাশ অন ডেলিভারিতে শপিং করুন - সারা বাংলাদেশে হোম ডেলিভারি! 🌸",
  fraudbdApiKey: "",
  steadfastUser: "",
  steadfastPassword: "",
  pathaoUsername: "",
  pathaoPassword: "",
  fbPixelId: "",
  smsApiToken: "",
};

interface StoreSettingRow {
  id: string;
  key: string;
  value: string;
  updatedAt: Date;
}

export async function GET(req: Request) {
  try {
    const rows = await (prisma as any).storeSetting.findMany();
    const settingsObj: Record<string, any> = { ...DEFAULT_SETTINGS };

    rows.forEach((row: StoreSettingRow) => {
      if (row.key === "announcementEnabled") {
        settingsObj[row.key] = row.value === "true";
      } else {
        settingsObj[row.key] = row.value;
      }
    });

    if (typeof settingsObj.announcementEnabled === "string") {
      settingsObj.announcementEnabled = settingsObj.announcementEnabled === "true";
    }

    return NextResponse.json({ settings: settingsObj }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });
  } catch (error: any) {
    console.error('Failed to fetch admin settings:', error);
    return NextResponse.json({ settings: DEFAULT_SETTINGS });
  }
}

export async function POST(req: Request) {
  const admin = await verifyAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Upsert each setting in PostgreSQL DB inside transaction
    const upsertPromises = Object.entries(body).map(([key, val]) => {
      const stringVal = typeof val === 'boolean' ? String(val) : String(val ?? '');
      return (prisma as any).storeSetting.upsert({
        where: { key },
        update: { value: stringVal },
        create: { key, value: stringVal },
      });
    });

    await prisma.$transaction(upsertPromises);

    const rows = await (prisma as any).storeSetting.findMany();
    const updatedSettings: Record<string, any> = { ...DEFAULT_SETTINGS };
    rows.forEach((row: StoreSettingRow) => {
      if (row.key === "announcementEnabled") {
        updatedSettings[row.key] = row.value === "true";
      } else {
        updatedSettings[row.key] = row.value;
      }
    });

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (error: any) {
    console.error('Failed to update admin settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
