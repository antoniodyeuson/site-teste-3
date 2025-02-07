import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
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