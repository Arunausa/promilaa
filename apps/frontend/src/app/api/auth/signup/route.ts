import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'promilaa-secret-key-2026';

// BUG 7 FIX: Basic in-memory rate limiter for signup (5 per 15 min per IP)
const signupAttempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(req: Request) {
  // Rate limiting check
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  const entry = signupAttempts.get(ip);
  
  if (entry) {
    if (now < entry.resetAt) {
      if (entry.count >= RATE_LIMIT) {
        return NextResponse.json({ message: 'Too many signup attempts. Please try again later.' }, { status: 429 });
      }
      entry.count++;
    } else {
      signupAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    }
  } else {
    signupAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  }

  try {
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email, and password are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists with this email' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        phone: phone || null,
        role: 'CUSTOMER',
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken: token,
    }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
