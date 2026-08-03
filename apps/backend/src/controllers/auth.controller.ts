import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../lib/prisma';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string(),
});

const generateTokens = (userId: string, role: string) => {
  const accessSecret = process.env.JWT_ACCESS_SECRET!;
  const refreshSecret = process.env.JWT_REFRESH_SECRET!;

  const accessToken = jwt.sign({ userId, role }, accessSecret, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId, role }, refreshSecret, { expiresIn: '30d' });

  return { accessToken, refreshToken };
};

const setRefreshCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Invalid input', errors: parsed.error.format() });
      return;
    }
    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: 'User with this email already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'CUSTOMER',
      },
    });

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);
    setRefreshCookie(res, refreshToken);

    res.status(201).json({
      message: 'Registration successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Invalid input', errors: parsed.error.format() });
      return;
    }
    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    if (user.isBlocked) {
      res.status(403).json({ message: 'Account unavailable, please contact support.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);
    setRefreshCookie(res, refreshToken);

    res.json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: 'No refresh token provided' });
      return;
    }

    const refreshSecret = process.env.JWT_REFRESH_SECRET!;
    jwt.verify(refreshToken, refreshSecret, async (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
      }

      // Re-fetch user to ensure they are not blocked or deleted
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user || user.isBlocked) {
        return res.status(403).json({ message: 'Account unavailable.' });
      }

      // Rotate tokens
      const tokens = generateTokens(user.id, user.role);
      setRefreshCookie(res, tokens.refreshToken);

      res.json({
        accessToken: tokens.accessToken,
      });
    });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

import crypto from 'crypto';

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return 200 to prevent email enumeration
      res.json({ message: 'If that email is registered, a password reset link has been sent.' });
      return;
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Store hash in DB, expires in 1 hour
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: resetTokenHash,
        resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000)
      }
    });

    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;
    
    // TODO: Nodemailer setup. For now, log it.
    console.log(`[EMAIL MOCK] Password Reset Link for ${email}: \n${resetUrl}\n`);

    res.json({ message: 'If that email is registered, a password reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
