import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Acesso negado. Apenas administradores podem acessar este recurso.' });
  }
};

export const isCreator = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role === 'creator') {
    next();
  } else {
    res.status(403).json({ error: 'Acesso negado. Apenas criadores podem acessar este recurso.' });
  }
};

export const isSubscriber = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role === 'subscriber') {
    next();
  } else {
    res.status(403).json({ error: 'Acesso negado. Apenas assinantes podem acessar este recurso.' });
  }
}; 