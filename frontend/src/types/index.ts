export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'creator' | 'subscriber';
  profileImage?: string;
}

export interface Content {
  id: string;
  title: string;
  description?: string;
  type: 'image' | 'video' | 'text';
  url: string;
  preview: string;
  isPreview: boolean;
  price?: number;
  views: number;
  likes: number;
  createdAt: string;
}

export interface DashboardStats {
  subscribers: number;
  earnings: number;
  views: number;
  likes: number;
} 