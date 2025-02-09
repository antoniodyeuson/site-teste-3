export interface Content {
  _id: string;
  title: string;
  description?: string;
  type: 'image' | 'video' | 'audio' | 'text';
  url: string;
  creatorId: string;
  creator?: {
    name: string;
    email?: string;
  };
  isPreview: boolean;
  createdAt: string;
} 