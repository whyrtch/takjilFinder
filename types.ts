
export enum MosqueStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

export interface MosqueLocation {
  lat: number;
  lng: number;
}

export interface Mosque {
  id: string;
  name: string;
  address: string;
  location: MosqueLocation;
  menu: string[];
  notes?: string;
  status: MosqueStatus;
  createdAt: number;
  createdBy?: string;
  distance?: string;
  image?: string;
  portion?: string;
  iftarTime?: string;
  thumbsUp?: number;
  thumbsDown?: number;
}

export interface User {
  uid: string;
  email: string;
  role: 'admin' | 'user';
}
