export interface Sign {
  id: string;
  word: string;
  category: string;
  region: string;
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
  informantId: string;
  likes: number;
  bookmarks: number;
  createdAt: string;
  handshape?: string;
  location?: string;
}

export interface Informant {
  id: string;
  name: string;
  location: string;
  bio: string;
  avatarUrl: string;
  contributions: number;
  badges: string[];
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
