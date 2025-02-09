import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';

export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Por favor, autentique-se.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado.' });
  }

  next();
};

export const isCreator = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Por favor, autentique-se.' });
  }

  if (req.user.role !== 'creator') {
    return res.status(403).json({ message: 'Acesso negado.' });
  }

  next();
};

export const isSubscriber = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Por favor, autentique-se.' });
  }

  if (req.user.role !== 'subscriber') {
    return res.status(403).json({ message: 'Acesso negado.' });
  }

  next();
}; 