declare namespace Express {
  export interface User {
    id: string;
    email: string;
    role: 'admin' | 'creator' | 'subscriber';
  }
} 