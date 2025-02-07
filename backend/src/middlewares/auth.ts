import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../types';

interface JwtUserPayload {
  userId: string;
  email: string;
  role: string;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No auth token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as JwtUserPayload;
    
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role
    } as User;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  next();
};

export const isCreator = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== 'creator') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  next();
}; 