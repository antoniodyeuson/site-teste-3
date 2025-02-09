import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { UserRole } from '../models/User';
import { AuthRequest, AuthRequestHandler } from '../types/express';

// Interface para estender o Request com user
interface TokenPayload {
  id: string;
}

export const auth: AuthRequestHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('Token não fornecido');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Por favor, autentique-se.' });
  }
};

export const checkRole = (roles: UserRole[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Por favor, autentique-se.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    next();
  };
}; 