import { Product, TransferResult } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';
const ORGANIZATION_ID = process.env.REACT_APP_ORGANIZATION_ID || '';

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Products
export async function getProducts(): Promise<Product[]> {
  return apiRequest<Product[]>('/products');
}

// Transfers - Send USDC from source account to recipient wallet
export async function createTransfer(params: {
  sourceAccountId: string;
  recipientWalletAddress: string;
  recipientName: string;
  blockchain?: 'ETHEREUM' | 'POLYGON' | 'BASE' | 'CELO';
  tokenAmount: number;
  memo?: string;
}): Promise<TransferResult> {
  return apiRequest<TransferResult>('/transfers', {
    method: 'POST',
    headers: {
      'on-behalf-of': ORGANIZATION_ID,
    },
    body: JSON.stringify(params),
  });
}
