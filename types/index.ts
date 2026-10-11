// Normalised shapes the UI works with. Raw backend responses are converted
// into these by lib/mappers.ts, so if the backend shape differs from what is
// assumed there, fix it in ONE place (mappers.ts) and nothing else changes.

export interface JwtPayload {
  id: string;
  username: string;
  age?: number;
  iat: number;
  exp: number;
}

export interface Session {
  id: string;
  username: string;
}

export interface Account {
  id: string;
  accountName: string;
  accountNumber: string;
  balance: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  senderId: string;
  receiverId: string;
  senderLabel: string; // filled only if the backend returns populated objects
  receiverLabel: string;
  amount: number; // backend stores a string; converted to number here
  description: string;
  createdAt: string;
}

export type Direction = "sent" | "received" | "other";

export interface LoginPayload {
  username: string;
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  age: number;
  dateOfBirth: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
}
