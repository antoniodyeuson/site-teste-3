import { Request } from 'express';
import { User } from './index';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export interface AuthRequest extends Request {
  user?: User;
}

declare namespace Express {
  export interface User {
    id: string;
    email: string;
    role: 'admin' | 'creator' | 'subscriber';
  }
} 