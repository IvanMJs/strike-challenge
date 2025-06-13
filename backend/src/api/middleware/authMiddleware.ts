import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, ROLES, UserRole } from '../../config/auth.config';
declare global {
  namespace Express {
    interface Request {      user?: {
        id: string;
        username: string;
        role: UserRole;
      };
    }
  }
}

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string; role: UserRole };
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    next(error);
  }
};

export const checkRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized - No user found' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Forbidden - Insufficient permissions'
      });
    }

    next();
  };
};
