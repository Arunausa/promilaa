import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user payload
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const accessSecret = process.env.JWT_ACCESS_SECRET;
  if (!accessSecret) {
    console.error('JWT_ACCESS_SECRET is not configured.');
    return res.status(500).json({ message: 'Internal server error.' });
  }

  jwt.verify(token, accessSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }

    req.user = decoded as { userId: string; role: string };
    next();
  });
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions.' });
    }

    next();
  };
};

// Aliases for cleaner route files
export const authenticate = authenticateToken;
export const authorizeAdmin = requireRole(['ADMIN', 'STAFF']);
