import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'promilaa-secret-key-2026';

export interface AdminSession {
  userId: string;
  email: string;
  role: string;
}

export async function verifyAdminAuth(req: Request): Promise<AdminSession | null> {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as AdminSession;
    if (!decoded || (decoded.role !== 'ADMIN' && decoded.role !== 'STAFF')) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}
