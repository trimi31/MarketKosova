export interface User {
  userId: number;
  username: string;
  email: string;
  role: string;
  token: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: string;
  userId: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  image: string | null;
  createdAt: string;
  userId: number;
  username: string;
  categoryId: number;
  categoryName: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface ApiError {
  timestamp: string;
  message: string;
  status: number;
  errors?: Record<string, string>;
}

export interface Conversation {
  id: number;
  listingId: number;
  listingTitle: string;
  listingImage: string | null;
  otherUserId: number;
  otherUsername: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
  createdAt: string;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  senderUsername: string;
  content: string;
  sentAt: string;
}
