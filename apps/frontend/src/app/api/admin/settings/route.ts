import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/adminAuth';

// In-memory / DB setting persistence store
let memorySettingsStore: any = {
  storeName: "PROMILAA BY SOPNIL",
  storePhone: "01601708251",
  storeEmail: "support@promilaa.com",
  bkashNumber: "01601708251",
  nagadNumber: "01601708251",
  rocketNumber: "01601708251",
  shippingDhaka: "80",
  shippingOutsideDhaka: "150",
  announcementEnabled: true,
  announcementText: "🌸 ক্যাশ অন ডেলিভারিতে শপিং করুন - সারা বাংলাদেশে হোম ডেলিভারি! 🌸",
  fraudbdApiKey: "",
  steadfastUser: "",
  steadfastPassword: "",
  pathaoUsername: "",
  pathaoPassword: "",
  fbPixelId: "",
  smsApiToken: "",
};

export async function GET(req: Request) {
  return NextResponse.json({ settings: memorySettingsStore });
}

export async function POST(req: Request) {
  const admin = await verifyAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  try {
    const body = await req.json();
    memorySettingsStore = {
      ...memorySettingsStore,
      ...body,
    };

    return NextResponse.json({ success: true, settings: memorySettingsStore });
  } catch (error: any) {
    console.error('Failed to update settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
